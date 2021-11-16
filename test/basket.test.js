const assert = require("assert");
const fruitBasketFactory = require("../basket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/baskithi';

const pool = new Pool({
    connectionString
});

describe('The fruitbasket function', function () {

    beforeEach(async function () {
        await pool.query("delete from basket;");
    });

    it('should create and return a new basket,', async function () {
        let fruitBasket = fruitBasketFactory(pool);

        await fruitBasket.newBasket('Apple', 1, '3.00');

        assert.deepEqual(await fruitBasket.findAllFruits('Apple'), 
        
        [{fruit_name: 'Apple', quantity: 1, price: '3.00'}])
    });

    it('should create a new basket and find the number of fruits in that basket', async function () {
        let fruitBasket = fruitBasketFactory(pool);

        await fruitBasket.newBasket('Apple', 1, '3.00');

        let findFruits = await fruitBasket.findAllFruits('Apple');

        assert.equal(findFruits[0].quantity, 1);
    });

    it('should create a new basket and update the number of fruits in that basket', async function () {
        let fruitBasket = fruitBasketFactory(pool);

        await fruitBasket.newBasket('Orange', 5, '15.00');
        await fruitBasket.updateFruitNumber('Orange', 2);

        let updateNumber = await fruitBasket.findAllFruits('Orange');
        assert.equal(updateNumber[0].quantity, 7);
    });

    it('should create a new basket and show the total price of fruit contained in that basket', async function () {
        let fruitBasket = fruitBasketFactory(pool);

        await fruitBasket.newBasket('Apples', 3, '3.00');
        await fruitBasket.newBasket('Banaba', 2, '2.00');
        await fruitBasket.newBasket('Banana', 2, '2.00');
        await fruitBasket.newBasket('Orange', 4, '4.00');
        await fruitBasket.newBasket('Orange', 4, '4.00');
       
        assert.equal(await fruitBasket.showTotalPrice('Orange'), '32.00');
        
    });

    it('should create a new basket and show the total number of fruit(s) contained in that basket', async function () {
        let fruitBasket = fruitBasketFactory(pool);

        await fruitBasket.newBasket('Banana', 1, '2.00');
        await fruitBasket.newBasket('Banana', 1, '2.00');
        await fruitBasket.newBasket('Apple', 1, '3.00');
        await fruitBasket.newBasket('Apple', 1, '3.00');
        await fruitBasket.newBasket('Orange', 1, '4.00');

        assert.equal(2, await fruitBasket.showTotalQty('Banana'));
    });

    after(function () {
        pool.end();
    })
});