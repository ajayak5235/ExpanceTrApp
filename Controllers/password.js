const bcrypt = require("bcrypt");
const { createTransport } = require('nodemailer')
var sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require('uuid')
const axios = require("axios");
const fs = require('fs');
const path = require('path')
const sequelize = require('../util/database')

//importing models
const User = require('../Models/user');
const forGotPassword = require('../Models/forgotpassword');


exports.forgotPasswd = async (req, res, next) => {
    try {
        const result = await User.findOne({
            where: {
                email: req.params.email
            }
        })
        console.log(result.id,'TESTING USER ID  in passwod js forgt');
        const uuid = uuidv4();
       
        if (result !== null) {

            const obj = {
                userId: result.id,
                isActive: true,
                uuid: uuid,
            }
            // console.log(obj);
            const forgotResult = await forGotPassword.create(obj);

            const defaultClient = sib.ApiClient.instance;
            const apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            // console.log(process.env.API_KEY);
            const transporter = createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                auth: {
                    user: "dk599318@gmail.com",
                    pass: process.env.PASS_ID,
                },
            });
            // // 
            const mailOptions = {
                from: 'ajaysinghak042@gmail.com',
                to: req.params.email,
                subject: `Your subject`,
                text: `Your reset link is -  http://localhost:4000/password/resetpassword/${uuid}       
        This is valid for 1 time only.`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).json({ message: ' something went wrong' })
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ message: "A reset link send to your email id", success: true, msg: 'ok' })
                }
            });
        }
        else {
            res.json({ message: "Invalid email id", status: 501 });
        }
    } catch (error) {
        console.log(error);
    }
}


exports.resetPassword = (req, res, next) => {
    const uuidd = req.params.uuidd;
    console.log(uuidd, 'TESTING UUID IN RESET PASSWORD USING PARAMS');

    forGotPassword.findOne({ where: { uuid: uuidd, isActive: true } })
        .then(result => {
            if (result) {
                fs.readFile(path.join(__dirname, '../setPassword.html'), 'utf8', (err, html) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('An error occurred.');
                    } else {
                        const updatedHtml = html.replace('<%= uuidd %>', uuidd);
                        res.send(updatedHtml);
                    }
                });
            } else {
                res.status(404).json({ message: 'Link is not valid', success: false });
            }
        }).catch(err => {
            console.error(err);
            res.status(500).send('An error occurred.');
        });
};

exports.changingPasswd = async (req, res, next) => {
    const uuidd = req.body.uuidd;
    const paswd = req.body.password;
    const t = await sequelize.transaction();

    try {
        const fp = await forGotPassword.findOne({ where: { uuid: uuidd, isActive: true }, transaction: t });

        if (fp) {
            const user = await User.findOne({ where: { id: fp.userId }, transaction: t });

            const hash = await bcrypt.hash(paswd, 10);
            await user.update({ password: hash }, { transaction: t });
            await fp.update({ isActive: false }, { transaction: t });

            await t.commit();
            res.status(200).json({ message: 'Your password is updated. Please go to the login page and log in again.', success: true });
        } else {
            res.status(404).json({ message: 'Link is not valid', success: false });
        }
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(503).json('An error occurred while updating the password.');
    }
};







