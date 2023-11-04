const User = require('../model/usermodel');
const Expense = require('../model/expensemodel');
const Url = require('../model/downloadURL')
const sequelize = require('../utility/database');
const S3Services = require('../services/S3services');


exports.downloadExpense = async (req, res, next) => {
    try {
        const userid = req.user.id;
        const expenses = await req.user.getExpenses();
        const stringExp = JSON.stringify(expenses);
        const filename = `Expense${userid}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringExp, filename);
        await Url.create({ url: fileURL, userId: userid })
        res.status(200).json({ fileURL, success: true })
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ fileURL: '', success: false, err: err })
    }
}

exports.downloadUrls = async (req, res, next) => {
    try {
        const urls = await Url.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ allUrls: urls });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: err.message })
    }
}


exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const userId = req.body.userId
        const category = req.body.category;
        
        const expense = await Expense.create({ amount: amount, description: description, category: category, userId: userId }, { transaction: t })
        const updatedexpense = Number(req.user.totalExpenses) + Number(amount)
        await User.update(
            { totalExpenses: updatedexpense },
            { where: { id: userId }, transaction: t })
        await t.commit();
        res.status(201).json({ addExpense: expense })

    } catch (err) {
        t.rollback();
        console.error("Error adding user:", err);
        res.status(500).json({ error: err.message })
    }
}

const ITEMS_PER_PAGE = 5;
exports.getExpense = async (req, res, next) => {
    const page = +req.query.page || 1;
    try {
        const totalExpenses = await Expense.count({
            where: { userId: req.user.id }
        });
        const offset = (page - 1) * ITEMS_PER_PAGE
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            offset: offset,
            limit: ITEMS_PER_PAGE,
        });
        res.status(200).json({
            allExpense: expenses,
            currentPage: page,
            hasNextPage: offset + expenses.length  < totalExpenses,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE)
        });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: err.message })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    await Expense.destroy({ where: { id: id } });
    res.sendStatus(204);
}