const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.generatAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretkey');
}
exports.postSignUp = (req, res, next) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        User.create({
            name: name,
            email: email,
            password: hash
        }).then(data => {
            console.log('Successfully signin db');
             return res.json(data);
        }).catch(err => console.log(err));
    })
}

exports.verifyUser = async (req, res, next) => {
    const { userEmail, userPassword } = req.body;
    User.findOne({ where: { email: userEmail } })
        .then(user => {
            if (user !== null) {
                bcrypt.compare(userPassword, user.password,async function (err, result) {
                    if (result == true) {
                        let token = await jwt.sign(user.id, 'secretkey')
                      
                       
                        console.log(user.ispremiumuser, ' USER PREMIUM ACTIVATE');
                        return res.json({ success: true, msg: 'User login successful', token: token, ispremiumuser: user.ispremiumuser })
                    }
                    else {
                        
                        res.status(401).json({ success: false, msg: 'User not authorized' })
                    }
                })
            } else {
                
                res.status(404).json({ success: false, msg: 'User not found' })
            }
        })
        .catch(err => {
            console.log(err, "ERROR ");
        })
}