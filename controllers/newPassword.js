const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const emails = require('../services/Email');

exports.newPassword = async (req, res) => {
  const { otp, password } = req.body;
  try {
    if (!otp || !password) {
      return res.json({ status: 'Fill all the details' });
    }
    if (password.length <= 7) {
      return res.json({ status: 'Password length must be atleast of 8 characters' });
    }

    const user = await Cred_vit.findOne({ recentotp: otp });

    if(user){
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();
        res.status(201).send('New password is set!');
    }

    else{
        res.status(404).send('Wrong OTP or user not found');
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ status: "There was some error, Please write OTP again!" })
  }
}
