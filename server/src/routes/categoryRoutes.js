import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoryController.list);
router.get('/:id', categoryController.getOne);
router.post('/', protect, admin, categoryController.create);
router.put('/:id', protect, admin, categoryController.update);
router.delete('/:id', protect, admin, categoryController.remove);

export default router;
