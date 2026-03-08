import orderModel from '../models/orderModel.js';

function groupOrdersById(ordersList) {
    const ordersMap = {};
    ordersList.forEach(row => {
        if (!ordersMap[row.orderid]) {
            ordersMap[row.orderid] = {
                numeroPedido: row.orderid,
                valorTotal: row.value,
                dataCriacao: row.creationdate,
                items: []
            };
        }
        if (row.productid) {
            ordersMap[row.orderid].items.push({
                idItem: row.productid,
                quantidadeItem: row.quantity,
                valorItem: row.price
            });
        }
    });
    return Object.values(ordersMap);
}

async function getOrders(_req, res) {
    try {
        const ordersList = await orderModel.getOrders();
        if (!ordersList || ordersList.length === 0) {
            return res.status(200).json({ message: 'No orders found' });
        }
        const ordersMap = groupOrdersById(ordersList);

        return res.status(200).json({ orders: ordersMap, message: 'Orders retrieved successfully' });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}


export default {
    getOrders,
    
};