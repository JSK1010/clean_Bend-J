const Cred_vit = require("../models/creds");
const crypto = require('crypto');
require("dotenv").config();

const emails = require('../services/Email');

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

exports.forgotPasswordEmail = async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
    console.log(email);
    const verificationCode = generateVerificationCode();

    try {
        if (!email) {
            return res.json({ status: 'Fill all the details' });
        }

        const oldUser = await Cred_vit.findOne({ email });

        if (!oldUser) return res.status(400).json({ message: "User does not exist" });

        oldUser.recentotp = verificationCode;
        await oldUser.save();

        let subject = 'Forgot Password'
        let text = `Your OTP is : ${verificationCode}.`

        emails.verifyUserEmail(email, subject, text) //create a recent otp option in the schema and then use that for checking the otp and password
        return res.json({ status: 'ok', msg: 'Mail sent' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ status: "There was some error, Please write email again!" })
    }
}