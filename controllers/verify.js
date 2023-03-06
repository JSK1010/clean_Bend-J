const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
require("dotenv").config();

const emails = require('../services/Email');

function generateVerificationCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

exports.verifygenerator = async (req, res) => {
  const { email, password } = req.body;
  const verificationCode = generateVerificationCode();

  try {
    if (!email || !password) {
      return res.json({ status: 'Fill all the details' });
    }
    if (password.length <= 7) {
      return res.json({ status: 'Password length must be atleast of 8 characters' });
    }

    const oldUser = await Cred_vit.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await Cred_vit.create({ email: email, password: hashedPassword, admin: false, verificationCode: verificationCode })

    const token = jwt.sign({ email: result.email, id: result._id }, process.env.verifyemail, { expiresIn: '1h' });

    // console.log(token);

    let subject = ' Welcome to IEEE 2nd International Conference on Vitecon'
    let text = `
Dear Author,
    
We are excited to welcome you to the IEEE 2nd International Conference on Vitecon.
Verify your account by clicking on the link below.
${process.env.backend}/verify?code=${result.verificationCode}


If you have difficulty using this site, please  mail to convenor.vitecon@vit.ac.in,  convenor.vitecon@gmail.com. 
Thank you.`

    emails.verifyUserEmail(email, subject, text)
    return res.json({ status: 'ok', msg: 'Signed up successfully. Please verify your email address.' })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ status: "There was some error, Please re-register with us" })
  }
}

exports.verify = async (req, res) => {
  const { code } = req.query;
  console.log({ code });
  const user = await Cred_vit.findOne({ verificationCode: code });
  if (user) {
    user.isverified = true;
    await user.save();
    res.send('Email address verified successfully. You can now close this page and proceed with login');
  } else {
    res.send('Invalid verification code.');
  }
};