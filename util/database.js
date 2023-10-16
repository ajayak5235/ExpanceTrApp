const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize  = new Sequelize('college', 'root',process.env.PASSW_KEY,{
    dialect: 'mysql' ,
    host:'localhost'
})
module.exports = sequelize;