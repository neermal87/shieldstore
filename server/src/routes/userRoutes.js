import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, userController.list);
router.get('/:id', protect, userController.getOne);
router.put('/profile', protect, userController.updateProfile);
router.put('/:id/role', protect, admin, userController.updateRole);

export default router;
