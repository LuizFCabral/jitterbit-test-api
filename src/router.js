import express from 'express';
import orders from './controllers/orderController.js';

const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Jitterbit Test API!' });
});

router.get('/orders/list', orders.getOrders);

router.get('/orders/:orderId', orders.getOrderById);

export default router;