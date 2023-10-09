const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forGotPassword = sequelize.define("forgotPasswordRequests", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  });
  

module.exports = forGotPassword;