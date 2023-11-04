const express = require('express');

const userAuthenticate = require('../middleware/auth')

const leaderController = require('../controller/leaderboard')

const router = express.Router();

router.get('/leaderboard', userAuthenticate.authenticate, leaderController.usertotalexp);

module.exports = router;