import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/esewa/init', paymentController.esewaInit);
router.get('/esewa/success', paymentController.esewaSuccess);

export default router;
