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

async function getOrderById(req, res) {
    const { orderId } = req.params;
    try {
        console.log(orderId);
        
        const orderData = await orderModel.getOrderById(orderId);
        console.log(orderData);
        
        if (!orderData || orderData.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderMap = groupOrdersById(orderData);

        return res.status(200).json({ order: orderMap[0], message: 'Order retrieved successfully' });
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createOrder(req, res) {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items || !Array.isArray(items)) {
        return res.status(400).json({ 
            error: 'Dados insuficientes.' 
        });
    }
    
    try {
        const orderId = await orderModel.createOrder(req.body);
        return res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Erro to create order' });
    }
}

async function deleteOrder(req, res) {
    const { orderId } = req.params;
    try {
        const result = await orderModel.deleteOrder(orderId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder
};