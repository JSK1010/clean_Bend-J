const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
const cors = require("cors");

exports.validation = async (req, res) => {

    const token = req.headers['x-access-token']
    
    try {
      const decoded =  jwt.verify(token, process.env.CLIENT_SECRET)
      const email = decoded.username
      const user = await Cred_vit.findOne({ email: email })
     console.log(user);
     
      return res.json({ status: 'ok', who:user})
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  }
