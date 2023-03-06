const Cred_vit = require("../models/creds");
const crypto = require('crypto');
require("dotenv").config();

const emails = require('../services/Email');

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

exports.forgotPasswordEmail = async (req, res) => {
    const { email } = req.body;
    const verificationCode = generateVerificationCode();

    try {
        if (!email) {
            return res.json({ status: 'Fill all the details' });
        }

        const oldUser = await Cred_vit.findOne({ email });

        if (!oldUser) return res.status(400).json({ status: "User does not exist" });

        oldUser.recentotp = verificationCode;
        await oldUser.save();

        let subject = 'Forgot Password'
        let text = `Dear Vitecon User,

Your OTP is : ${verificationCode}
       
If you have difficulty using this site, please  mail to convenor.vitecon@vit.ac.in,  convenor.vitecon@gmail.com. 
Thank you.`
        

        emails.verifyUserEmail(email, subject, text) 
        return res.json({ status: 'ok', msg: 'Mail sent' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ status: "There was some error, Please write email again!" })
    }
}