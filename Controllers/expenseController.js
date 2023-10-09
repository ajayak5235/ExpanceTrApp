const jwt = require('jsonwebtoken');
require('dotenv').config();

const Expense = require('../Models/expense');
const User = require('../Models/user');
const sequelize = require('../util/database');

exports.AddExpense = async (req, res, next) => {
    const token = req.body.token;
    let id;
    jwt.verify(token, 'secretkey', (err, decrypt) => {
        if (err) {
            return res.status(500).json({ success: false })
        }
        id = decrypt;
    })

    const t = await sequelize.transaction();

    try {
        const { amount, desc, category } = req.body;
        const ExpenseTableCraeted = await Expense.create({
            amount: amount,
            desc: desc,
            category: category,
            userId: id
        }, {
            transaction: t
        });

        const user = await User.findOne({ where: { id: id }, transaction: t })
        let sum = parseFloat(user.totalExpense) + parseFloat(ExpenseTableCraeted.amount);

        await user.update({ totalExpense: sum }, { transaction: t })

        await t.commit();
        res.json(ExpenseTableCraeted);

    } catch (err) {
        console.log(err, 'ERROR OCCURED   IN EXPENSE TABLE');
        res.status(500).json(err);
        await t.rollback();
    }
}
exports.getExpense = (req, res, next) => {
     console.log(process.env.RAZORPAY_KEY_ID);
    Expense.findAll({ where: { userId: req.id } })
        .then(ExpenseRowData => {
            res.json(ExpenseRowData);
        })
        .catch(err => console.log(err));

    }


exports.DeleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const id = req.body.id;
    try {
        const deleteExpense = await Expense.findByPk(id);
        // console.log(deleteExpense,'NULLLL');
        const userid = deleteExpense.dataValues.userId;
        // console.log(userid,'USER ID -------????????>>>>>>>>>>>>>>');
        const users = await User.findOne({ where: { id: userid }, transaction: t })
        await deleteExpense.destroy({ where: { id: id } }, { transaction: t });
        const updatedSum = users.totalExpense - deleteExpense.amount;
        await users.update({ totalExpense: updatedSum }, { transaction: t });

        await t.commit();
        console.log('SUCCESSFULLYYYY DELETEDDDDD -------------->>>>>>>>>>>>>>>>>');
        res.status(201).json({ success: true, msg: 'DELETED' });
        // res.redirect('/expense/add-expense');
    } catch (err) {
        await t.rollback();
        console.log(err);
    }
}






