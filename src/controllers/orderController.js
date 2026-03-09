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

function mapFields(data) {
    return {
        numeroPedido: data.numeroPedido ?? data.orderId,
        valorTotal: data.valorTotal ?? data.value,
        dataCriacao: data.dataCriacao ?? data.creationDate,
        items: (data.items || []).map(item => ({
            idItem: item.productId ?? item.idItem,
            quantidadeItem: item.quantity ?? item.quantidadeItem,
            valorItem: item.price ?? item.valorItem
        }))
    };
};
    
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
   /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do pedido (Aceita formato PT ou EN)',
            schema: {
                "numeroPedido": "v10089015vdb-01",
                "valorTotal": 10000,
                "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
                "items": [
                    {
                        "idItem": "2434",
                        "quantidadeItem": 1,
                        "valorItem": 1000
                    }
                ]
            }
    } */
    const data = req.body;

    const dataMapped = mapFields(data);    

    if (!dataMapped.numeroPedido || !dataMapped.valorTotal || !dataMapped.dataCriacao || !dataMapped.items || !Array.isArray(dataMapped.items)) {
        return res.status(400).json({ 
            error: 'Dados insuficientes.' 
        });
    }
    
    try {
        const orderId = await orderModel.createOrder(dataMapped);
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

async function updateOrder(req, res) {
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do pedido (Aceita formato PT ou EN)',
            schema: {
                "numeroPedido": "v10089015vdb-01",
                "valorTotal": 10000,
                "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
                "items": [
                    {
                        "idItem": "2434",
                        "quantidadeItem": 1,
                        "valorItem": 1000
                    }
                ]
            }
    } */
    const { orderId } = req.params;
    const orderData = req.body;

    const dataMapped = mapFields(orderData);

    const order = await orderModel.getOrderById(orderId);

    if (!order || order.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const orderMap = {
        ...order[0],
        numeroPedido: dataMapped.numeroPedido,
        valorTotal: dataMapped.valorTotal,
        dataCriacao: dataMapped.dataCriacao
    };

    try {
        const result = await orderModel.updateOrder(orderId, orderMap);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrder
};