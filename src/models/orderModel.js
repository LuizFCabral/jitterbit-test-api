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

async function createOrder(orderData) {
    const client = await pool.connect(); // Trava um cliente para gerenciar a transação

    try {
        await client.query('BEGIN');

        // 1. Inserir na tabela "Order"
        const orderQuery = `
            INSERT INTO "Order" (orderId, value, creationDate) 
            VALUES ($1, $2, $3) 
            RETURNING orderId
        `;
        const orderValues = [
            orderData.numeroPedido, 
            orderData.valorTotal, 
            orderData.dataCriacao
        ];
        
        const responseOrder = await client.query(orderQuery, orderValues);
        const savedOrderId = responseOrder.rows[0].orderid;

        // 2. Inserir os Itens
        const itemQuery = `
            INSERT INTO Items (orderId, productId, quantity, price) 
            VALUES ($1, $2, $3, $4)
        `;

        for (const item of orderData.items) {
            const itemValues = [
                savedOrderId,
                item.idItem,
                item.quantidadeItem,
                item.valorItem
            ];
            await client.query(itemQuery, itemValues);
        }

        await client.query('COMMIT'); 
        return savedOrderId;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro na transação de pedido:', error);
        throw error;
    } finally {
        client.release(); // Libera o cliente de volta para o pool
    }
}

async function deleteOrder(orderId) {
    try {
        await pool.query('DELETE FROM "Order" WHERE orderId = $1', [orderId])
        return { message: 'Order deleted successfully' };
    }
    catch (error) {
        console.error('Erro ao deletar pedido:', error);
        throw error;
    }
}

async function updateOrder(orderId, orderData) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        // Atualizar a tabela "Order"
        const orderQuery = `
            UPDATE "Order"
            SET value = $1, creationDate = $2
            WHERE orderId = $3
        `;
        const orderValues = [
            parseFloat(orderData.valorTotal), 
            orderData.dataCriacao, 
            orderId
        ];
        await client.query(orderQuery, orderValues);

        await client.query('COMMIT');
        return { message: 'Order updated successfully' };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating order:', error);
        throw error;
    } finally {
        client.release();
    }
}

export default {
    getOrders, 
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrder
};