const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize  = new Sequelize(process.env.Database_name, process.env.Datab_Root ,process.env.Datab_Pass,{
    dialect: 'mysql' ,
    host:process.env.Host_name
})
module.exports = sequelize;

