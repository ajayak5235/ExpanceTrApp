const Razorpay = require('razorpay');
require('dotenv').config();

const Order = require('../Models/order');
const User = require('../Models/user');
const Expense = require('../Models/expense')
const signUpController = require('./signupcontroller');
const sequelize = require('../util/database');

exports.purchasepremium = async (req, res) => {
    try {
        console.log(process.env.RAZORPAY_KEY_ID,'TESTING RAZORPAY KEY ID --?');
        var rzp = new Razorpay({
            key_id: "rzp_test_p3zwjFACezGjAS",
            key_secret: "iFSKvqIV3JW2ZtXtRMBadFyR"
        })
        const amount = 1000;
        //console.log(process.env.RAZORPAY_KEY_ID);
        const createOrder = () => {
            return new Promise((resolve, reject) => {
                rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(order);
                    }
                });
            });
        };

        // Create the order and handle errors
        const order = await createOrder();

        // Create a Premium record and handle errors
        await Order.create({ orderid: order.id, status: 'PENDING', userId: req.id });

        res.status(201).json({ order, key_id: rzp.key_id });

    } catch (err) {
        console.log(err)
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}

exports.updateTransactionStatus = async (req, res) => {
    const id = req.id;
    const uorderid = req.body.order_id;
    const upaymentid = req.body.payment_id;
    if (!req.body.suc) {
        try {
            
            console.log('payment passed')
            const p1 = Order.findAll({ where: { orderid: uorderid } })
                .then(result => { result[0].update({ paymentid: upaymentid, status: 'SUCCESSFUL' }) })
            const p2 = User.findAll({ where: { id: req.id } }).then(re => { re[0].update({ ispremiumuser: true }) })

            Promise.all([p1, p2]).then(() => {
                return res.status(202).json({ success: true, message: "Transactions successful", token: signUpController.generatAccessToken(id, undefined, true) })
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "transaction cancelled due to error"
            })
        }
    } else {
        try {
            console.log('payment failing in controllers')
            const p1 = Order.findAll({ where: { orderid: uorderid } }).then(result => { result[0].update({ paymentid: upaymentid, status: 'FAIL' }) })

            const p2 = User.findAll({ where: { id: req.id } }).then(re => { re[0].update({ ispremiumuser: false }) })

            Promise.all([p1, p2]).then(() => {
                return res.status(202).json({ success: true, message: "Transactions unsuccessful" })
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            return res.status(403).json({ success: false, message: err.message })
        }
    }
}

exports.getLeaderBoards = async (req,res) => {
    try{
        const leaderBoard = await User.findAll({ 
            attributes: ['id','name', 'totalExpense'],
            order:[['totalExpense','DESC']]
        });
        res.status(201).json(leaderBoard);

    }catch(err){
        console.log('ERROR OCCURED WHILE GETTING LEADERBOARD DETAILS ');
        res.status(500).json(err);
    }
}