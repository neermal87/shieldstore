import express from 'express';
import passport from 'passport';
import '../config/passport.js';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export default router;
