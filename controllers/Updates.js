const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();
const emails = require('../services/Email');
const tokencontinue = require('../Middleware/tokencontinue')
const tokenadmin = require('../Middleware/tokenadmin')




exports.decision = async (req, res) => {


  const token = req.headers['x-access-token']
  const userchange = req.headers['user']
  const rev = req.headers['body']
  const revision = JSON.parse(rev)
  try {
    // const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
    // const email = decoded.username
    // const user = await Cred_vit.findOne({ email: email })

    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {

      d = false;
      console.log('trying to delete')
      Cred_vit.updateOne({ email: userchange }, { $unset: { Author_Name: 1, Author_Type: 1, Institution: 1, Address: 1, Mobile: 1, IEEE_No: 1, Coauthors: 1, Affiliation: 1, Paper_Title: 1, Domain: 1 }, $set: { Revision: revision, Waiting: '', Warning: 'R', Decision: false } }, err => {
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
      const path = appDir + "/uploads/" + userchange + '.pdf';
      try {
        fs.unlinkSync(path);
        console.log("File removed:", path);
        let subject = 'Your paper has been rejected for some reasons'
        let text = 'You can visit you login page to know more about the reason\nYou can now submit a new paper'
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
      Cred_vit.updateOne({ email: userchange }, { $set: { Warning: warning, Revision: revision, Decision: d, Waiting: color } }, err => {
        if (err) {
          console.log(err);
        }
        else {
          let subject = 'You paper needs to be modified'
          let text = 'The paper is accepted with some revision, visit you account to know more about the revision'
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

  const userchange = req.headers['user']
  try {
    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }

    else {
      try {

        Cred_vit.updateOne({ email: userchange }, { $set: { Warning: 'None', Waiting: 'G', Decision: true, Revision: 'No revisions Required' } }, err => {
          if (err) {
            console.log(err);
          }
          else {
            let subject = 'Your paper is accepted without any further revision'
            let text = 'you can see the details in your login page.'
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