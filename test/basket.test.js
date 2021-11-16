let assert = require("assert");
let fruitBasketFactory = require("../basket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/baskithi';

const pool = new Pool({
    connectionString
});

describe('The fruitbasket function', function () {
    let fruitBasket = fruitBasketFactory(pool);

    beforeEach(async function () {
        await pool.query("delete from basket;");
    });

    it('should find all the fruit baskets for a given fruitBasket Banana,', async function () {

        await fruitBasket.newBasket('Banana', 1, '3.00');

        assert.deepEqual(await fruitBasket.findAllFruits('Banana'), 
        
        [{fruit_name: 'Banana', price: '3.00', quantity: 1}])
    });

    it('should update the number of fruits in a given basket Banana', async function () {
        await fruitBasket.newBasket('Banana', 1, '3.00');
        await fruitBasket.updateFruitNumber('Banana', 3);
        let find = await fruitBasket.findAllFruits('Banana');
        assert.equal(find[0].quantity, 4);
    });

    

    after(function () {
        pool.end();
    })
});