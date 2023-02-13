const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')






exports.decision = async (req, res) => {
    
 ``
        const token = req.headers['x-access-token']
        const userchange=req.headers['user']
        const rev=req.headers['body']
        const revision = JSON.parse(rev)
        try {
          const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
          const email = decoded.username
          const user = await Cred_vit.findOne({ email: email })
          if(user){
            
              d=false;
              console.log('trying to delete')
              Cred_vit.updateOne({email:userchange}, {$unset:{Author_Name:1,Author_Type:1,Institution:1,Address:1,Mobile:1,IEEE_No:1,Coauthors:1,Affiliation:1,Paper_Title:1,Domain:1},$set:{Revision:revision,Waiting:'',Warning:'R',Decision:false}},err=>{
                if(err){
                  console.log(err);
                }
                else{
                  console.log("deleted");
                }
              });
              const fs = require("fs");
              const { dirname } = require('path');
              const appDir = dirname(require.main.filename);
              const path = appDir+"/uploads/"+userchange+'.pdf';            
              try {
                fs.unlinkSync(path);
                console.log("File removed:", path);
                return res.json({status:'ok'});
              } catch (err) {
                console.error(err);
                return res.json({status:'err'})
              }
      
              }
      
                  }
         
        
        catch (error) {
          console.log(error)
          res.json({ status: 'error', error: 'invalid token' })
        }
      }
exports.warning = async (req, res) => {
          const warning=req.params.id;
          
          const rev=req.headers['body']
          const revision = JSON.parse(rev)
          d=true;
          color='O'
          const token = req.headers['x-access-token']
          const userchange=req.headers['user']
          try {
            const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
            const email = decoded.username
            const user = await Cred_vit.findOne({ email: email })
            if(user){
              Cred_vit.updateOne({email:userchange}, {$set:{Warning:warning,Revision:revision,Decision:d,Waiting:color}},err=>{
                if(err){
                  console.log(err);
                }
                else{
                  return res.json({status:'ok'});
                }
              });
                
        
            }
           
          
          } catch (error) {
            console.log(error)
            res.json({ status: 'error', error: 'invalid token' })
          }
        }

exports.color = async (req, res) => {        
    const warning=req.params.id;
    const revision=req.headers['revision']
    let msg=''
    color='yellow'
    const token = req.headers['x-access-token']
    const userchange=req.headers['user']
    try {
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
      const email = decoded.username
      const user = await Cred_vit.findOne({ email: email })
      if(user){
        try{
        const nuser = await Cred_vit.findOne({ email: userchange })
        if(nuser.Waiting){
        color=nuser.Waiting;}
        if(nuser.Revision){
        msg=nuser.Revision;
        }
        console.log(nuser.email)
        console.log(color+' given');
        return res.json({status:'ok',color:color,msg:msg});
        }
        catch(error){
          console.log(error);
          res.json({status:error})
        }
  
      }
     
    
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  }
  
exports.finalized = async (req, res) => {
      const token = req.headers['x-access-token']
      const userchange=req.headers['user']
      try {
        const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
        const email = decoded.username
        const user = await Cred_vit.findOne({ email: email })
        if(user){
          try{
    
          Cred_vit.updateOne({email:userchange}, {$set:{Warning:'None',Waiting:'G',Decision:true,Revision:'No revisions Required'}},err=>{
            if(err){
              console.log(err);
            }
            else{
              return res.json({status:'ok'});
            }
          });
    
    
          }
          catch(error){
            console.log(error);
            res.json({status:error})
          }
    
        }
       
      
      } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
      }
    }