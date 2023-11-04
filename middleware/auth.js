const jwt = require('jsonwebtoken')
const User = require('../model/usermodel');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secret')
        User.findByPk(user.userId)
        .then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            console.log('inauthentication')
            next();
        }).catch (err => {
            console.log(err)})
    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}