const express = require('express');

 const userAuthenticate = require('../middleware/auth')

const userController = require('../controller/user')

 const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/signup', userController.postUser);

router.post('/login', userController.loginUser);

router.get('/download', userAuthenticate.authenticate, expenseController.downloadExpense)

router.get('/downloadurls', userAuthenticate.authenticate, expenseController.downloadUrls)

module.exports = router;