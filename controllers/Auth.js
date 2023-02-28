const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();

exports.done_signin = async (req, res) => {
  const user = await Cred_vit.findOne({
    email: req.body.username,
    admin: false
  })

  if (!user) {
    return res.json({ status: 'no user found' });
  }

  if (!user.isverified) {
    return res.status(404).send({ message: 'User not verified' });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  )
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        username: user.email,

      },
      process.env.CLIENT_SECRET, { expiresIn: '600000' }
    )
    return res.json({ status: 'ok', user: token })
  }
  else {
    res.json({ status: 'wrong password', user: false });
  }
}


exports.admin_signup = async (req, res) => {
  const user = await Cred_vit.findOne({
    email: req.body.username,
    admin: true
  })

  if (!user) {
    return res.json({ status: 'no user found' });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  )
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        username: user.email,

      },
      process.env.CLIENT_SECRET, { expiresIn: '600000' }
    )
    console.log(user)

    return res.json({ status: 'ok', user: token })
  }
  else {
    res.json({ status: 'wrong password', user: false });
  }

}


exports.check = async (req, res) => {
  return res.json({ status: 'up and running' });
}