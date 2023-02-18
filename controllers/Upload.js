const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();
const emails = require('../services/Email');
const tokencontinue = require('../Middleware/tokencontinue')
const counter = require('../services/counter')
const tracks = require("../models/tracks");

exports.comments = async (req, res) => {
  let decision;
  let waiting;
  let revision = 'Not yet Reviewed';
  let warning = 'Will be updated shortly';

  try {
    let user = await tokencontinue.tokencontinue(req, res);

    if (!user) {
      throw 'Invalid Tokensss'
    }


    if (user.Decision == true) {
      decision = true;
      waiting = user.Waiting;
      revision = user.Revision;
      warning = user.Warning;
    }
    else if (user.Decision == false) {
      decision = false;
      warning = user.Warning;
      revision = user.Revision;
    }
    else {
      decision = undefined
    }

    return res.json({ status: 'ok', decision: decision, revision: revision, warning: warning, waiting: waiting });



  } catch (error) {
    console.log(error)
    return res.json({ status: error });
  }
}


exports.upload_details = async (req, res) => {
  try {
    let a = tokencontinue.tokencontinue(req, res);
    if (!a) {
      throw 'Invalid Token'
    }
    const Author_Name = JSON.parse(JSON.stringify(req.body.Author_Name));
    const Author_Type = JSON.parse(JSON.stringify(req.body.Author_Type));
    const Institution = JSON.parse(JSON.stringify(req.body.Institution));
    const Address = JSON.parse(JSON.stringify(req.body.Address));
    const Mobile = JSON.parse(JSON.stringify(req.body.Mobile));
    const IEEE_No = JSON.parse(JSON.stringify(req.body.IEEE_no));
    const Coauthors = JSON.parse(JSON.stringify(req.body.Coauthors));
    const Affiliation = JSON.parse(JSON.stringify(req.body.Affiliation));
    const Title = JSON.parse(JSON.stringify(req.body.Paper_Title));
    const Domain = JSON.parse(JSON.stringify(req.body.Domain));
    const user = JSON.parse(JSON.stringify(req.body.user));

    var pdfnum = 0

    saved = false;



    if (req.files === null) {
      return res.json({ msg: 'no file uploaded' });
    }
    console.log(req.files.file);
    const file = req.files.file;
    if (file.name.endsWith('pdf')) {
      await tracks.findOneAndUpdate({ name: Domain }, { $inc: { count: 1 } }).then(function (data, err) {
        if (!err) {
          pdfnum = data.count

        }
        else {

          console.log(err)

        }
      });
      file.mv(`uploads/${Domain}${pdfnum}.pdf`, err => {

        if (err) {
          console.error(err);
          return res.json({ error: 500 })
        }


        Cred_vit.updateOne({ email: user }, { $set: { Author_Name: Author_Name, Author_Type: Author_Type, Institution: Institution, Address: Address, Mobile: Mobile, IEEE_No: IEEE_No, Coauthors: Coauthors, Affiliation: Affiliation, Paper_Title: Title, Domain: Domain, pdfid: pdfnum, Waiting: 'B', Warning: 'Will be updated shortly', Revision: 'Not yet Reviewed' }, $unset: { Decision: 1 } }, err => {
          if (err) {
            console.log(err);
          }
          else {
            saved = true
          }
        });

        let text = 'Your paper has been received successfully, Kindly wait for the further revisions \nYou will receive mail regarding this shortly.'
        let subject = 'Thank you for submitting the paper.'
        emails.verifyUserEmail(user, subject, text)
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, Saved_in_monogdb: saved });

      });
    }


    else {
      res.json({ error: 600 })
    }
  }
  catch (err) {
    console.log(err);
    res.json({ error: 600 })
  }
};

exports.reupload = async (req, res) => {

  var dom = ''
  var num = ''
  const token = req.headers['x-access-token']
  const decoded = jwt.verify(token, process.env.CLIENT_SECRET)
  const email = decoded.username
  try {
    let a = await tokencontinue.tokencontinue(req, res);

    if (!a) {
      throw 'Invalid Tokensss'
    }


    saved = false;
    const user = JSON.parse(JSON.stringify(req.body.user));
    if (req.files === null) {
      return res.json({ msg: 'no file uploaded' });
    }
    console.log(req.files.file);
    const file = req.files.file;
    if (file.name.endsWith('pdf')) {

      await Cred_vit.findOne({ email: email }).then(function (docs, err) {
        if (!err) {
          console.log(docs, email)
          dom = docs.Domain
          num = docs.pdfid
          file.mv(`uploads/${docs.Domain}${docs.pdfid}.pdf`, err => {

            if (err) {
              console.error(err);
              return res.json({ error: 500 })
            }

            revision = ''
            Cred_vit.updateOne({ email: user }, { Waiting: "B" }, err => {
              if (err) {
                console.log(err);
              }
              else {
                saved = true
              }
            });
            let subject = 'Your modified paper has been received successfully'
            let text = 'Your paper will be reviewed shortly.\nYou will be receiving a mail regarding the review shorly'
            emails.verifyUserEmail(user, subject, text)
            res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, Saved_in_monogdb: saved });

          });
        }
        else {
          throw 'not found'
        }
      })


    }


    else {
      console.log("NOT A PDF")
      res.json({ error: 600 })

    }
  }
  catch (err) {
    console.log(err)
    res.json({ error: 700 })
  }



};