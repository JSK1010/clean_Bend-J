const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
const cors = require("cors");
require("dotenv").config();


module.exports = {
    tokenadmin: async function tokenadmin(req,res) {


    
try {
  const token = req.headers['x-access-token']
  const decoded =  jwt.verify(token, process.env.CLIENT_SECRET)
  const email = decoded.username
  const user = await Cred_vit.findOne({ email: email,admin:true })
 console.log(user);
 
  return user;
} catch (error) {
  console.log(error)
  return 0;
}
    }
}