import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, productController.list);
router.get('/:id', productController.getOne);
router.post('/', protect, admin, productController.create);
router.put('/:id', protect, admin, productController.update);
router.delete('/:id', protect, admin, productController.remove);

export default router;
