const express = require('express');
const router = express.Router({ mergeParams: true });
const paymentController = require('../controllers/payment.controller');

router.post('/transactions', paymentController.newTransaction);
// router.put('/transactions', paymentController.acceptTransaction);
router.put('/transactions/:transactionId', paymentController.updateTransaction);
router.get('/transactions', paymentController.getTransactions);
router.get('/transactions/:transactionId', paymentController.getTransaction);
router.delete('/transactions', paymentController.deleteTransactions);
router.delete('/transactions/:transactionId', paymentController.deleteTransaction);

module.exports = router;
