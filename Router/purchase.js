const express = require('express');

const controller = require('../Controllers/purchase');
const authorization = require('../middleware/auth');

const route = express.Router();

route.get('/buypremium',authorization.Authorized,controller.purchasepremium);
route.post('/updatingTransactionStatus',authorization.Authorized,controller.updateTransactionStatus);
route.get('/leaderBoard',controller.getLeaderBoards);

module.exports = route;