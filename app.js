const path = require('path')
const fs = require('fs')


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Sib = require('sib-api-v3-sdk')
const app = express();

const sequelize = require('./util/database');

const User = require('./Models/user');
const Expense = require('./Models/expense');
const Order = require('./Models/order');
const forGotPassword = require('./Models/forgotpassword');
const DownloadedFile = require('./Models/download');
const helmet = require('helmet');
const compression = require('compression')
const morgan = require('morgan')

const router = require('./Router/route');
const Xrouter = require('./Router/expenseroute');
const PremuimRoutes = require('./Router/purchase');
const passwordRoute = require('./Router/passwordRoute')

// const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{
//     flags:'a'
// })

// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined',{stream: accessLogStream}));



app.use(cors());
app.use(express.json());

app.use('/user', router);
app.use('/expense', Xrouter);
app.use('/premium', PremuimRoutes);
app.use('/password', passwordRoute);





// creating relationship b/w Tables
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forGotPassword);
forGotPassword.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

sequelize.sync().then(res => {
    app.listen(4000);
}).catch(err => {
    console.log(err);
});