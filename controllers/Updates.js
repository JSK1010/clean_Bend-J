const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();
const emails = require('../services/Email');
const tokencontinue = require('../Middleware/tokencontinue')
const tokenadmin = require('../Middleware/tokenadmin')




exports.decision = async (req, res) => {


  var Author_Name;
  var Paper_Title;
  var domain;
  var id;
  const token = req.headers['x-access-token']
  const userchange = req.headers['user']
  const rev = req.headers['body']
  const revision = JSON.parse(rev)
  try {
    var id=0;
    var domain='';

    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {

      d = false;
      console.log('trying to delete')
      await Cred_vit.findOne({ email: userchange }).then(function(data){
        if(data){
         
              Author_Name=data.Author_Name;
              Paper_Title=data.Paper_Title;
              domain=data.Domain;
              id=data.pdfid; 
      
        }
      })
      await Cred_vit.updateOne({ email: userchange }, { $unset: { Author_Name: 1, Author_Type: 1, Institution: 1, Address: 1, Mobile: 1, IEEE_No: 1, Coauthors: 1, Affiliation: 1, Paper_Title: 1, Domain: 1,pdfid:1 }, $set: { Revision: revision, Waiting: '', Warning: 'R', Decision: false } }).then(function(data,err){
        if (err) {
          console.log(err);
        }
        else {
          console.log("deleted");
        }
      });
      
      const fs = require("fs");
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
      const path = appDir + "/uploads/" + domain+id + '.pdf';
      try {
        fs.unlinkSync(path);
        console.log("File removed:", path);
        let subject = 'Your paper has been rejected for some reasons'
        let text = `Dear ${Author_Name},
Manuscript ID  "${domain+id}" entitled "${Paper_Title}" which you submitted to IEEE 2nd International Conference   ViTECoN- 2023  has been reviewed.             
A revised version of your manuscript that takes into account the comments of the referee(s) will be reconsidered for publication.      
The comments of the referee(s) are included in the following link, You can upload your revised manuscript and submit it through "https://vitecon.vit.ac.in/".                                                                                                  
Once again, thank you for submitting your manuscript to IEEE 2nd International Conference   ViTECoN- 2023  and I look forward to receiving your revision.                                                 
       
If you have difficulty using this site, please  mail to convenor.vitecon@vit.ac.in,  convenor.vitecon@gmail.com. 
Thank you.`
        emails.verifyUserEmail(userchange, subject, text)
        return res.json({ status: 'ok' });
      } catch (err) {
        console.error(err);
        return res.json({ status: 'err' })
      }

    }

  }


  catch (error) {
    console.log(error)
    res.json({ status: 'error', error: 'invalid token' })
  }
}
exports.warning = async (req, res) => {
  var Author_Name;
  var Paper_Title;
  var domain;
  var id;
  const warning = req.params.id;

  const rev = req.headers['body']
  const revision = JSON.parse(rev)
  d = true;
  color = 'O'
  const token = req.headers['x-access-token']
  const userchange = req.headers['user']
  try {
    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {
     await Cred_vit.findOne({ email: userchange }).then(function(data){
      if(data){
        Author_Name=data.Author_Name;
        Paper_Title=data.Paper_Title;
        domain=data.Domain;
        id=data.pdfid; 

      }
     })
     await Cred_vit.updateOne({ email: userchange }, { $set: { Warning: warning, Revision: revision, Decision: d, Waiting: color } }).then(function(data,err){
        if (err) {
          console.log(err);
        }
        else {
          let subject = 'You paper got Revised!'
          let text = `Dear ${Author_Name},
          Manuscript ID  "${domain}${id}" entitled "${Paper_Title}" which you submitted to IEEE 2nd International Conference ViTECoN- 2023  has been reviewed.             
A revised version of your manuscript that takes into account the comments of the referee(s) will be reconsidered for publication.      
The comments of the referee(s) are included in the following link, You can upload your revised manuscript and submit it through "https://vitecon.vit.ac.in/".                                                                                                   
Once again, thank you for submitting your manuscript to IEEE 2nd International Conference   ViTECoN- 2023  and I look forward to receiving your revision.                                                 
          
If you have difficulty using this site, please  mail to convenor.vitecon@vit.ac.in,  convenor.vitecon@gmail.com. 
Thank you`
          emails.verifyUserEmail(userchange, subject, text)
          return res.json({ status: 'ok' });
        }
      });


    }


  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: 'invalid token' })
  }
}

exports.color = async (req, res) => {
  const warning = req.params.id;
  const revision = req.headers['revision']
  let msg = ''
  color = 'yellow'
  const token = req.headers['x-access-token']
  const userchange = req.headers['user']
  try {
    let user = await tokenadmin.tokenadmin(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {
      try {
        const nuser = await Cred_vit.findOne({ email: userchange })
        if (nuser.Waiting) {
          color = nuser.Waiting;
        }
        if (nuser.Revision) {
          msg = nuser.Revision;
        }
        console.log(nuser.email)
        console.log(color + ' given');
        return res.json({ status: 'ok', color: color, msg: msg });
      }
      catch (error) {
        console.log(error);
        res.json({ status: error })
      }

    }


  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: 'invalid token' })
  }
}

exports.finalized = async (req, res) => {
  var Author_Name;
  var Paper_Title;
  var domain;
  var id;
  const userchange = req.headers['user']
  try {
    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {
      try {

        await Cred_vit.findOne({ email: userchange }).then(function(data){
          if(data){
            Author_Name=data.Author_Name;
            Paper_Title=data.Paper_Title;
            domain=data.Domain;
            id=data.pdfid; 
    
          }
         })
        Cred_vit.updateOne({ email: userchange }, { $set: { Warning: 'None', Waiting: 'G', Decision: true, Revision: 'No revisions Required' } }, err => {
          if (err) {
            console.log(err);
          }
          else {
            let subject = 'Your paper is accepted!'
            let text = `Dear ${Author_Name},
Manuscript ID  "${domain}${id}" entitled "${Paper_Title}" which you submitted to IEEE 2nd International Conference   ViTECoN- 2023  has been reviewed and accepted.      
The comments of the referee(s) are included in the following link, You can check your revised manuscript in status section of "https://vitecon.vit.ac.in/".                                                                                                   
Once again, thank you for submitting your manuscript to IEEE 2nd International Conference   ViTECoN- 2023  and I look forward to receiving your revision.                                                 
          
If you have difficulty using this site, please  mail to convenor.vitecon@vit.ac.in,  convenor.vitecon@gmail.com. 
Thank you.`
            emails.verifyUserEmail(userchange, subject, text)
            return res.json({ status: 'ok' });
          }
        });


      }
      catch (error) {
        console.log(error);
        res.json({ status: error })
      }

    }


  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: 'invalid token' })
  }
}