const express = require('express');

const expenseController = require('../controller/expense');
const userAuthenticate = require('../middleware/auth')

const router  = express.Router();

router.post('/add-expense',userAuthenticate.authenticate , expenseController.postExpense);

router.get('/get-expense', userAuthenticate.authenticate , expenseController.getExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;