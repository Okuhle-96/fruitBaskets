module.exports = function FruitBasket(pool) {

    async function newBasker(fruit_name, quantity, price) {
        await pool.query('insert into basket (fruit_name, quantity, price) values($1, $2, $3)', [fruit_name, quantity, price])
    }

    async function findAllFruits(fruit) {
        const fruits = await pool.query('select fruit_name, quantity, price from basket where fruit_name = $1', [fruit])

        return fruits.rows;
    }

    async function updateFruitNumber(fruit, quantity) {
        await pool.query('update basket set quantity = quantity + $2 where fruit_name = $1', [fruit, quantity])
    }

    async function showTotalPrice(fruit) {
        const total = await pool.query('select (price*quantity) as price from basket where fruit_name = $1', [fruit])

        return total.rows[0].price;
    }

    async function showTotalQty(fruitType) {
        const qty = await pool.query('select sum(price*quantity) as total from basket where fruit_name = $1', [fruitType])
        
        return qty.rows[0].total;
    }

    return {
        createBasket,
        findFruit,
        updateFruit,
        totalPrice,
        totalQty
    }
}

