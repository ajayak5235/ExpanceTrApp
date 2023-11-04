const express = require('express');
const userAuthenticate = require('../middleware/auth')
const purchaseController = require('../controller/purchase')
const router  = express.Router();

router.get('/premiummembership', userAuthenticate.authenticate, purchaseController.purchasepremium)

router.post('/updatetranstatus', userAuthenticate.authenticate, purchaseController.updatetranstatus)

module.exports = router