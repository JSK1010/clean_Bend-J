const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
const cors = require("cors");
require("dotenv").config();
const token=require('../Middleware/token')

exports.validation = async (req, res) => {

    token.token(req,res);
    
  }
