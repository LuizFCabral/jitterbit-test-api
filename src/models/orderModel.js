import pool from '../db.js';

async function getOrders() {
    const query = `SELECT 
        o.orderId,
        o.value,
        o.creationDate,
        i.productId, 
        i.quantity, 
        i.price
    FROM "Order" o
    LEFT JOIN Items i ON o.orderId = i.orderId
    ORDER BY o.creationDate DESC`;
    const res = await pool.query(query);
    return res.rows;
}

async function getOrderById(orderId) {
    const query = `SELECT 
        o.orderId,
        o.value,
        o.creationDate,
        i.productId, 
        i.quantity, 
        i.price
    FROM "Order" o
    LEFT JOIN Items i ON o.orderId = i.orderId
    WHERE o.orderId = $1
    ORDER BY o.creationDate DESC`;
    const res = await pool.query(query, [orderId]);
    return res.rows;
}




export default {
    getOrders, 
    getOrderById,
};