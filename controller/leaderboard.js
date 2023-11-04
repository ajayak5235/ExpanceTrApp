const Expense = require('../model/expensemodel');
const User = require('../model/usermodel');
const sequelize = require('../utility/database');

exports.usertotalexp = async (req, res, next) => {
    try {
        const leaderboardexp = await User.findAll({
            attributes: ['name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']]
        })
        // console.log(leaderboardexp);
        res.status(200).json(leaderboardexp);

    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({
            error: err.message

        })
    }
}