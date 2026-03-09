import express from 'express';
import orders from './controllers/orderController.js';
import auth from './auth.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Jitterbit Test API!' });
});

router.post('/login', auth.login)

router.get('/orders/list', auth.authtoken, orders.getOrders); /* #swagger.security = [{ "bearerAuth": [] }] */

router.get('/orders/:orderId', auth.authtoken, orders.getOrderById); /* #swagger.security = [{ "bearerAuth": [] }] */

router.post('/orders', orders.createOrder); /* #swagger.security = [{ "bearerAuth": [] }] */

router.delete('/orders/:orderId', auth.authtoken, orders.deleteOrder); /* #swagger.security = [{ "bearerAuth": [] }] */

router.put('/orders/:orderId', auth.authtoken, orders.updateOrder); /* #swagger.security = [{ "bearerAuth": [] }] */

export default router;