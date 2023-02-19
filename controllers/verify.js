const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const emails = require('../services/Email');
const open=require('open')

exports.verifygenerator = async (req, res) => {
    try{
      if (!req.body.username || !req.body.password) {
        return res.json({ status: 'Fill all the details' });
      }
      if (req.body.password.length <= 7) {
        return res.json({ status: 'Password length must be atleast of 8 characters' });
      }
   
    Cred_vit.findOne({ email: req.body.username }, async function (err, doc) {
      if (doc != null) {
        console.log('account already exists');
        res.json({ status: 'account already exists' });
  
      }})
  
      const token = jwt.sign({email: req.body.username,password:req.body.password}, process.env.verifyemail, { expiresIn: '10m' }  
  );  
      let subject = 'Verify You Vitecon account'
              let text = `Hi! There, You have recently visited 
              our website and entered your email.
              Please follow the given link to verify your email
              http://localhost:5000/verify/${token} 
              Thanks`
  
              emails.verifyUserEmail(req.body.username,subject,text)
              return res.json({status:'ok',msg:'check your email and verify'})
  }
  catch(err){
    console.log(err)
return res.json({status:"There was some error, Please re-register with us"})
  }
}

 
  exports.verify = async (req, res) => {
  try{ 
    const token = req.params.id;
    const decoded = jwt.verify(token, process.env.verifyemail)
    const email = decoded.email
    const password = decoded.password
    const newPassword = await bcrypt.hash(password, 10)
    await Cred_vit.findOne({ email: email,admin: false }).then(function (item, err) {
      
if(item){
        throw 'Acc'
      }
    }
    )
    
           
                Cred_vit.create({ email: email,password:newPassword,admin: false }).then(function (item, err) {
                  if(!err){
                    res.send("Account Created Succesfully");
                    open('http://localhost:3000/#/login')
                  }
                  else{
                    res.send('error')
                  }
                })
                     
        }

    catch(err){
      if(err=='Acc'){
        res.send("Account already exists");
      }
      else{
        res.send("Email verification failed, possibly the link is invalid or expired");
      }
      
    }
  };