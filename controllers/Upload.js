const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();


exports.comments = async (req, res) => {
        const token = req.headers['x-access-token']
        let decision;
        let waiting;
        let revision='Not yet Reviewed';
        let warning='Will be updated shortly';
      
        try {
          const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
          const email = decoded.username
          const user = await Cred_vit.findOne({ email: email })
          
          if(user.Decision==true){
   decision=true;
   waiting=user.Waiting;
   revision=user.Revision;
   warning=user.Warning;
          }
          else if(user.Decision==false){
            decision=false;
            warning=user.Warning;
            revision=user.Revision;
          }
          else{
            decision=undefined
          }
          
         return res.json({status:'ok',decision:decision,revision:revision,warning:warning,waiting:waiting});
     
    
  
        } catch (error) {
          console.log(error)
          return res.json({status:error});
        }
      }
 

exports.upload_details = (req, res) => {

        const Author_Name=JSON.parse(JSON.stringify(req.body.Author_Name));
        const Author_Type=JSON.parse(JSON.stringify(req.body.Author_Type));
        const Institution=JSON.parse(JSON.stringify(req.body.Institution));
        const Address=JSON.parse(JSON.stringify(req.body.Address));
        const Mobile=JSON.parse(JSON.stringify(req.body.Mobile));
        const IEEE_No=JSON.parse(JSON.stringify(req.body.IEEE_no));
        const Coauthors=JSON.parse(JSON.stringify(req.body.Coauthors));
        const Affiliation=JSON.parse(JSON.stringify(req.body.Affiliation));
        const Title=JSON.parse(JSON.stringify(req.body.Paper_Title));
        const Domain=JSON.parse(JSON.stringify(req.body.Domain));
        const user=JSON.parse(JSON.stringify(req.body.user));
        
        
        saved=false;
        
        
        
          if(req.files===null){
            return res.status(400).json({msg:'no file uploaded'});
          }
          console.log(req.files.file);
          const file=req.files.file;
          if(file.name.endsWith('pdf')){
          
          file.mv(`uploads/${user}.pdf`,err =>{
        
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
        
            Cred_vit.updateOne({email:user}, {$set:{ Author_Name:Author_Name,Author_Type:Author_Type,Institution:Institution,Address:Address,Mobile:Mobile,IEEE_No:IEEE_No,Coauthors:Coauthors,Affiliation:Affiliation,Paper_Title:Title,Domain:Domain,Waiting:'B',Warning:'Will be updated shortly',Revision:'Not yet Reviewed'},$unset:{Decision:1}},err=>{
              if(err){
                console.log(err);
              }
              else{
                saved=true
              }
            });
            res.json({ fileName: file.name, filePath: `/uploads/${file.name}`,Saved_in_monogdb:saved });
        
          });
          }
        
        
          else{
            return res.status(600).send('error');
          }
        };      

exports.reupload = async (req, res) => {        

          let revision;
          const token = req.headers['x-access-token']
          try {
            const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
            const email = decoded.username
            const User = await Cred_vit.findOne({ email: email })
        
        
           saved=false;
           const user=JSON.parse(JSON.stringify(req.body.user));
            if(req.files===null){
              return res.status(400).json({msg:'no file uploaded'});
            }
            console.log(req.files.file);
            const file=req.files.file;
            if(file.name.endsWith('pdf')){
            file.mv(`/uploads/${user}.pdf`,err =>{
          
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
          
              revision=''
              Cred_vit.updateOne({email:user}, {Waiting:"B"},err=>{
                if(err){
                  console.log(err);
                }
                else{
                  saved=true
                }
              });
              res.json({ fileName: file.name, filePath: `/uploads/${file.name}`,Saved_in_monogdb:saved });
          
            });
            }
          
          
            else{
              return res.status(600).send('error');
            }
          }
          catch(err){
            console.log(err)
           return res.status(700).send('error');
          }
          
        
        
          };