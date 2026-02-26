import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, orderController.create);
router.get('/', protect, orderController.list);
router.get('/:id', protect, orderController.getOne);
router.put('/:id/status', protect, admin, orderController.updateStatus);

export default router;
