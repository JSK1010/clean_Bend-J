const fs = require('fs');
const Cred_vit = require("../models/creds");
const jwt = require('jsonwebtoken')
require("dotenv").config();
const tokencontinue = require('../Middleware/tokencontinue')
const tokenadmin = require('../Middleware/tokenadmin')

exports.view = async (req, res) => {
  
  try {
    
    var a = await tokenadmin.tokenadmin(req, res);
    if (!a) {
      throw "unknown user";
    }

    else {
      const news = []
      const { dirname } = require('path');
      const appDir = dirname(require.main.filename);
      var files = fs.readdirSync(appDir + '/uploads/');
      var count=0
      files.forEach((e) => {
        if (e != '.gitkeep')
          count=count+1;
          news.push(e.split('.pdf')[0])
      })
      return res.json({ uploads: news, PaperCount: count })
    }




  }
  catch (err) {
    return res.json({ status: err })
  }
}