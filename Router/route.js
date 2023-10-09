const express = require('express');

const router = express.Router();

const controller = require('../Controllers/signupcontroller');


router.post('/signUp', controller.postSignUp);
router.post('/signIn', controller.verifyUser);

module.exports = router;