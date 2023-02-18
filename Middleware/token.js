const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
const cors = require("cors");
require("dotenv").config();

module.exports = {
  token: async function token(req, res) {
    try {
      const token = req.headers['x-access-token']
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
      const email = decoded.username
      const user = await Cred_vit.findOne({ email: email })
      console.log(user);

      return res.json({ status: 'ok', who: user })
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  }
}


