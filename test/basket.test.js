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
        await fruit.createBasket('Banana', 1, '3.00');
        assert.deepEqual(await fruit.findFruit('Banana'), [{fruit_name: 'Banana', price: '3.00', quantity: 1}])
    });

    it('should find all the fruit baskets for a given fruit Pineapple,', async function () {
        await fruit.createBasket('Pineapple', 1, '12.00');
        assert.deepEqual(await fruit.findFruit('Pineapple'), [{fruit_name: 'Pineapple', price: '12.00', quantity: 1}])
    });

    it('should update the number of fruits in a given basket Banana', async function () {
        await fruit.createBasket('Banana', 1, '3.00');
        await fruit.updateFruit('Banana', 3);
        let find = await fruit.findFruit('Banana');
        assert.equal(find[0].quantity, 4);
    });

    it('should update the number of fruits in a given basket Strawberry', async function () {
        await fruit.createBasket('Strawberry', 5, '15.00');
        await fruit.updateFruit('Strawberry', 2);
        let find = await fruit.findFruit('Strawberry');
        assert.equal(find[0].quantity, 7);
    });

    it('should show the total price for a given fruit basket Banana', async function () {
        await fruit.createBasket('Banana', 2, '3.00');
        assert.equal(await fruit.totalPrice('Banana'), '6.00')
    });

    it('should show the total price for a given fruit basket Apple', async function () {
        await fruit.createBasket('Apple', 3, '1.50');
        assert.equal(await fruit.totalPrice('Apple'), '4.50')
    });

    it('should show the sum of the total of the fruit baskets for a given fruit type Kiwi', async function () {
        await fruit.createBasket('Kiwi', 1, '5.00');
        await fruit.createBasket('Kiwi', 3, '5.00');
        await fruit.createBasket('Banana', 6, '5.00');

        assert.equal(20, await fruit.totalQty('Kiwi'))
    });

    it('should show the sum of the total of the fruit baskets for a given fruit type Grapes', async function () {
        await fruit.createBasket('Grapes', 3, '10.00');
        await fruit.createBasket('Grapes', 5, '10.00');
        assert.equal(80, await fruit.totalQty('Grapes'))
    });

    after(function () {
        pool.end();
    })
});