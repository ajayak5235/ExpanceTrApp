const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controller/forgotpassword');

router.post('/forgotpassword', forgotPasswordController.userForgotPassword);

router.get('/updatepassword/:resetpasswordid', forgotPasswordController.updatepassword)

router.get('/resetpassword/:id', forgotPasswordController.resetpassword)

module.exports = router;


