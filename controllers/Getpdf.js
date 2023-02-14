const fs = require('fs');
const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')

exports.getpdf = async (req, res) => {

    const ff=req.params.id
     try {
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
         const src = fs.createReadStream(appDir+'/uploads/'+ff+'.pdf');
   
     res.writeHead(200, {
       'Content-Type': 'application/pdf',
       'Content-Disposition': 'attachment; filename=sample.pdf',
       'Content-Transfer-Encoding': 'Binary'
     });
   
     src.pipe(res); 
   
     } catch (error) {
       res.json({status:error});
     }
   }
   
exports.infos = async(req, res) => {
   
    const token = req.headers['x-access-token']
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
      
    try {
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
      const email = decoded.username
      const user =  await Cred_vit.findOne({ email: email })
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
      var files = fs.readdirSync(appDir+'/uploads/');
      
      files.forEach((e)=>{
          news.push(e.split('.pdf')[0])
       })
  
       console.log(news.length)
       news.forEach(async (e)=>{
        console.log(e)
        await Cred_vit.findOne({email: e},function(err,docs){
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
  
  
  console.log(Author_Name.length,news.length)
  if(Author_Name.length==news.length){
    console.log('sent')
  res.json({status:'ok',file:news,Author_Name:Author_Name,Author_Type:Author_Type,Institution:Institution,Address:Address,Mobile:Mobile,IEEE_No:IEEE_no,Coauthors:Coauthors,Affiliation:Affiliation,Paper_Title:Paper_Title,Domain:Domain})
  }
  }
        });
        
        
       
       });
       
  
  
       
  
   
     } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  
  
      
  
  
  }
  