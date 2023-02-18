const fs = require('fs');
const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();
const tokencontinue=require('../Middleware/tokencontinue')
const tokenadmin=require('../Middleware/tokenadmin')

exports.getpdf = async (req, res) => {
  var dom=''
  var num=0
  
   let a=tokencontinue.tokencontinue(req,res);
    if(!a){
throw 'Invalid Token'
    }
    const ff=req.params.id
     try {
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
      await Cred_vit.findOne({email:ff}).then(function(docs,err){
        if(!err){
dom=docs.Domain
num=docs.pdfid
         }
        else{
          console.log("error in finding")
          console.log(err);
        }})
        
        
        
         const src = fs.createReadStream(appDir+`/uploads/${dom}${num}.pdf`);
   
     res.writeHead(200, {
       'Content-Type': 'application/pdf',
       'Content-Disposition': 'attachment; filename=sample.pdf',
       'Content-Transfer-Encoding': 'Binary'
     });
   
     src.pipe(res); 
   
     } catch (error) {
      console.log(error)
       res.json({status:error});
     }
   }
   
exports.infos = async(req, res) => {
   

      const news=[]
      const Author_Name=[]
      const Author_Type=[]
      const Institution=[]
      const Address=[]
      const Mobile=[]
      const IEEE_no=[]
      const Coauthors=[]
      const Affiliation=[]
      const Paper_Title=[]
      const Domain=[]
      const Pdfid=[]
      const filess=[]
      
    try {
      // const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
      // const email = decoded.username
      // const user =  await Cred_vit.findOne({ email: email })
      var a= await tokenadmin.tokenadmin(req,res);
      if(!a){
        throw "unknown user";
      }
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
      var files = fs.readdirSync(appDir+'/uploads/');
      
      files.forEach((e)=>{
        if(e!='.gitkeep')
          news.push(e.split('.pdf')[0])
       })
  
       console.log(news.length)
       news.forEach((e)=>{
        console.log(e)

        split_string = e.split(/(\d+)/)
        console.log("Text:" + split_string[0] + " & Number:" + split_string[1])
       
       Cred_vit.findOne({Domain: split_string[0],pdfid:split_string[1]},function(err,docs){
          if(err){
    console.log('error');
           }
  else{
  Author_Name.push(docs.Author_Name);
  Author_Type.push(docs.Author_Type);
  Institution.push(docs.Institution);
  Address.push(docs.Address);
  Mobile.push(docs.Mobile);
  IEEE_no.push(docs.IEEE_No);
  Coauthors.push(docs.Coauthors);
  Affiliation.push(docs.Affiliation);
  Paper_Title.push(docs.Paper_Title);
  Domain.push(docs.Domain);
  filess.push(docs.email);
  Pdfid.push(docs.pdfid)
  
  
  console.log(Author_Name.length,news.length)
  if(Author_Name.length==news.length){
    console.log('sent')
  res.json({status:'ok',file:filess,Author_Name:Author_Name,Author_Type:Author_Type,Institution:Institution,Address:Address,Mobile:Mobile,IEEE_No:IEEE_no,Coauthors:Coauthors,Affiliation:Affiliation,Paper_Title:Paper_Title,Domain:Domain,Pdfid:Pdfid})
  }
  }
        });
        
        
       
       });
       
  
  
       
  
   
     } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  
  
      
  
  
  }
  
  exports.mypdfinfo = async(req, res) => {
    const token = req.headers['x-access-token']
  const decoded =  jwt.verify(token, process.env.CLIENT_SECRET)
  const email = decoded.username
   var dom=''
   var num=0
  try {
    var a= await tokencontinue.tokencontinue(req,res);
    if(!a){
      throw "unknown user";
    }
    
   
    
    await Cred_vit.findOne({email:email,pdfid:{ $exists: true, $ne: null }}).then(function(docs,err){
        if(err){
          console.log(err)
         }
else{
  if(docs){
  dom=docs.Domain
  num=docs.pdfid
  return res.json({status:'ok',paperid:`${dom}${num}`})
}
else{
  return res.json({status:'ok',paperid:0})
}
  
}
});
      
      
     
     }
     catch(err){
      console.log(err)
      return res.json({status:err})
     }
     
    }


     

 
