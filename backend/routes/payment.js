const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.post('/cash', paymentController.processCashPayment);
router.post('/qris', paymentController.generateQRISPayment);
router.get('/qris/status/:orderId', paymentController.checkQRISPaymentStatus);
router.get('/receipt/:orderId', paymentController.showReceipt);

module.exports = router;
