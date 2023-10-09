
const express = require('express');

const router = express.Router();

const controller = require('../Controllers/expenseController')
const Dcontroller = require('../Controllers/downloadController')
const authorization = require('../middleware/auth');


router.post('/add-expense', controller.AddExpense);
router.get('/add-expense', authorization.Authorized,controller.getExpense);
router.post('/delete-expense', controller.DeleteExpense);



// DOWNLOAD URL

router.get('/download',authorization.Authorized,Dcontroller.downloading)
router.get('/download/allurl',authorization.Authorized,Dcontroller.allUrl)

module.exports = router;