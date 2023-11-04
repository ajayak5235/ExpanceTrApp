const Forgotpassword = require('../model/forgotmodel');
const User = require('../model/usermodel');

const uuid = require('uuid');
const bcrypt = require('bcrypt');

 require('dotenv').config()

const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']

const userForgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            const id = uuid.v4();
            Forgotpassword.create({ id, active: true , userId: user.id })
                .catch(err => {
                    throw new Error(err)
                })

            apiKey.apiKey = process.env.API_KEY;
            const transEmailApi = new Sib.TransactionalEmailsApi()

            const sender = {
                email: 'ajaysinghak71@gmail.com',
                name: 'Ajay singh'
            }

            const receivers = [
                {
                    email: email,
                }
            ]

            transEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Your Password [ExpenseTrackerApp]',
                htmlContent: `<p> Now Click the link below to Reset your password </p> 
                    <a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`
            })
                .then((response) => {
                    return res.json({ message: 'Link to reset password sent to your mail ', sucess: true })

                })
                .catch((error) => {
                    throw new Error(error);
                })

        } else {
            throw new Error('User doesnt exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id = req.params.id;
    Forgotpassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New Password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`
            )
            res.end()
        }
    })
}

const updatepassword = async (req, res) => {

    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    try {
        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

        if (!resetpasswordrequest) {
            return res.status(404).json({ error: 'No reset password request found', success: false });
        }

        const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });

        if (!user) {
            return res.status(404).json({ error: 'No user exists', success: false });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newpassword, salt);

        await user.update({ password: hash });

        res.status(201).json({ message: 'Successfully updated the new password' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }

}


module.exports = {
    userForgotPassword,
    updatepassword,
    resetpassword
}
















