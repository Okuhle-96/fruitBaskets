let assert = require("assert");
let fruitBasket = require("../basket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/baskithi';

const pool = new Pool({
    connectionString
});

describe('The fruitbasket function', function () {
    let fruit = fruitBasket(pool);

    beforeEach(async function () {
        await pool.query("delete from basket;");
    });

    it('should find all the fruit baskets for a given fruit Banana,', async function () {
        await fruit.newBasket('Banana', 1, '3.00');
        assert.deepEqual(await fruit.findAllFruits('Banana'), [{fruit_name: 'Banana', price: '3.00', quantity: 1}])
    });

    it('should find all the fruit baskets for a given fruit Pineapple,', async function () {
        await fruit.newBasket('Pineapple', 1, '12.00');
        assert.deepEqual(await fruit.findAllFruits('Pineapple'), [{fruit_name: 'Pineapple', price: '12.00', quantity: 1}])
    });

    it('should update the number of fruits in a given basket Banana', async function () {
        await fruit.newBasket('Banana', 1, '3.00');
        await fruit.updateFruitNumber('Banana', 3);
        let find = await fruit.findAllFruits('Banana');
        assert.equal(find[0].quantity, 4);
    });

    it('should update the number of fruits in a given basket Strawberry', async function () {
        await fruit.newBasket('Strawberry', 5, '15.00');
        await fruit.updateFruitNumber('Strawberry', 2);
        let find = await fruit.findAllFruits('Strawberry');
        assert.equal(find[0].quantity, 7);
    });

    it('should show the total price for a given fruit basket Banana', async function () {
        await fruit.newBasket('Banana', 2, '3.00');
        assert.equal(await fruit.showTotalPrice('Banana'), '6.00')
    });

    it('should show the total price for a given fruit basket Apple', async function () {
        await fruit.newBasket('Apple', 3, '1.50');
        assert.equal(await fruit.showTotalPrice('Apple'), '4.50')
    });

    it('should show the sum of the total of the fruit baskets for a given fruit type Kiwi', async function () {
        await fruit.newBasket('Kiwi', 1, '5.00');
        await fruit.newBasket('Kiwi', 3, '5.00');
        await fruit.newBasket('Banana', 6, '5.00');

        assert.equal(20, await fruit.showTotalQty('Kiwi'))
    });

    it('should show the sum of the total of the fruit baskets for a given fruit type Grapes', async function () {
        await fruit.newBasket('Grapes', 3, '10.00');
        await fruit.newBasket('Grapes', 5, '10.00');
        assert.equal(80, await fruit.showTotalQty('Grapes'))
    });

    after(function () {
        pool.end();
    })
});