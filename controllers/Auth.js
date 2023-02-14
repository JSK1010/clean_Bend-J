const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();


exports.done_signup = async (req, res) => {

    if(req.body.password.length<=7){
      return res.json({ status: 'Password length must be atleast of 8 characters'});
    }
    if(req.body.username.length<=4){
      return res.json({ status: 'Username length must be atleast of 5 characters'});
    }
      Cred_vit.findOne({email:req.body.username},async function(err,doc){
      if(doc!=null){
          console.log('account already exists');
          res.json({ status: 'account already exists'});
          
      }
      else{
        console.log(req.body)
        const newPassword = await bcrypt.hash(req.body.password, 10)
          Cred_vit.create({email:req.body.username,password:newPassword,admin:false},function(err,item){
              if(err){
                  console.log(err);
                  res.json({ status: 'err'});
              }
              else{
                  
                     res.json({ status: 'ok'});  
                  
              }
             });
      }
  });
  
  
}


exports.done_signin = async (req, res) => {
    const user = await Cred_vit.findOne({
      email: req.body.username,
      admin:false
    })
  
    if (!user) {
     return res.json({ status: 'no user found'});
    }
  
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if(isPasswordValid){
      const token = jwt.sign(
			{
				username: user.email,
				
			},
			process.env.CLIENT_SECRET,{ expiresIn: '600000' }
		)

		return res.json({ status: 'ok', user: token })
    }
    else{
      res.json({ status: 'wrong password',user:false});
    }
  
}


exports.admin_signup = async (req, res) => {
      const user = await Cred_vit.findOne({
        email: req.body.username,
        admin:true
      })
    
      if (!user) {
       return res.json({ status: 'no user found'});
      }
    
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      )
      if(isPasswordValid){
        const token = jwt.sign(
        {
          username: user.email,
          
        },
        process.env.CLIENT_SECRET,{ expiresIn: '600000' }
      )
      console.log(user)
      return res.json({ status: 'ok', user: token })
      }
      else{
        res.json({ status: 'wrong password',user:false});
      }

}    

exports.check = async (req, res) => {
  return res.json({status:'up and running'});
}