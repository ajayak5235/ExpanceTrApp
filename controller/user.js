const User  = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const postUser = async (req, res, next) => {
    try {
       const {name,email,password} = req.body;
        const existingUser = await User.findOne({ where: {email: email}})
        if(existingUser){
            res.json({message : "User Already Exist!"})
        }else {
            bcrypt.hash(password, 10, async (err, hash) => {
                  console.log('err', err);
                  await User.create({
                    name: name,
                    email: email, 
                    password: hash
                })
                res.status(201).json({message : "User Signup Successfully!"})
            })
        }
    } catch { err => console.log(err) }
}


const generateToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id , name : name , ispremiumuser}, 'secret');
}


const loginUser = async (req, res, next) => {
    try {
      const {email,password} = req.body;
        
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    res.status(500).json({ message: "Something went wrong" });
                }
                if (response === true) {
                    res.status(200).json({
                        success: true,
                        message: "Login Successfully",
                        userId: user.id,
                        token: generateToken(user.id, user.name, user.ispremiumuser)
                    });
                } else {
                    res.json({ success: false, message: "Password is incorrect" });
                }
            });
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    loginUser,
    postUser,
    generateToken
}
