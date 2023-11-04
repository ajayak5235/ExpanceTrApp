require('dotenv').config()
const path = require('path');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const sequelize = require('./utility/database')


const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require('./routes/userroute');


const expenseRoutes = require('./routes/expenseroute')
const purchaseRoutes = require('./routes/purchaseroute')
const leaderboardRoutes = require('./routes/leaderboardroute')
const resetPassword =require('./routes/forgotpasswordroute')
const Forgotpassword = require('./model/forgotmodel')
const Expense = require('./model/expensemodel')


app.use(cors());

app.use(express.json());


const User = require('./model/usermodel')
const Order = require('./model/ordermodel')
const Url = require('./model/downloadURL')


app.use('/user', userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', leaderboardRoutes)
app.use('/password', resetPassword)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Url);
Url.belongsTo(User);

sequelize
   
    .sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => console.log(err))