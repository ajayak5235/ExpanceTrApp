const Sequelize = require('sequelize');

const sequelize  = new Sequelize('expenseapp', 'root','Ajay123@',{
    dialect: 'mysql' ,
    host:'localhost'
})
module.exports = sequelize;