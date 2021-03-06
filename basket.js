module.exports = function FruitBasket(pool) {

    async function newBasket(fruit_name, quantity, price) {
        await pool.query('insert into basket (fruit_name, quantity, price) values($1, $2, $3)', [fruit_name, quantity, price]);
    }

    async function findAllFruits(type) {
        const allFruits = await pool.query('select fruit_name, quantity, price from basket where fruit_name = $1', [type]);

        return allFruits.rows;
    }

    async function updateFruitNumber(fruit_name, quantity) {
        await pool.query('update basket set quantity = quantity + $2 where fruit_name = $1', [fruit_name, quantity]);
    }

    async function showTotalPrice(fruit) {
        const totalPrice = await pool.query('select sum(quantity*price) as price from basket where fruit_name = $1', [fruit]);

        return totalPrice.rows[0].price;
    }

    async function showTotalQty(type) {
        const totalQty = await pool.query('select sum(quantity) as total from basket where fruit_name = $1', [type]);
        
        return totalQty.rows[0].total;
    }

    return {
        newBasket,
        findAllFruits,
        updateFruitNumber,
        showTotalPrice,
        showTotalQty
    }
}

