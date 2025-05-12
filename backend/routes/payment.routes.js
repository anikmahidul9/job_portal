import express from "express";
import { initPayment, paymentIPN, paymentSuccess, verifyPayment } from "../controller/payment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post('/init', isAuthenticated,initPayment );
router.post('/success', paymentSuccess);
router.post('/verify', verifyPayment);
router.post('/ipn', paymentIPN);

export default router;