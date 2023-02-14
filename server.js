//////////////
require("dotenv").config();
const express=require("express");
const app=express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json());
const cors = require("cors");
app.use(cors());
const fs = require('fs');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const PORT = process.env.PORT || 5000;

/////////////
const check = require("./routes/check");
const signup = require("./routes/signup");
const signin = require("./routes/signin");
const signin_admin = require("./routes/signin_admin");
const user_validation = require("./routes/user_validation");
const comments= require("./routes/comments");
const upload_details= require("./routes/upload_details");
const reupload= require("./routes/reupload");
const getpdf= require("./routes/getpdf");
const getpdfinfos= require("./routes/getpdfinfos");
const decision= require("./routes/decision");
const warning= require("./routes/warning");
const color= require("./routes/color");
const finalized= require("./routes/finalized");


/////////////
const database = require("./keys/keys");
mongoose.connect(database,{ useNewUrlParser: true });
/////////////

app.use("/check",check);
app.use("/done_signup", signup);
app.use("/done_signin", signin);
app.use("/done_signin_admin", signin_admin)
app.use("/validation_papers", user_validation)
app.use("/getComments", comments)
app.use("/upload", upload_details)
app.use("/uploadagain", reupload)
app.use("/getpdf", getpdf)
app.use("/getpdfinfos", getpdfinfos)
app.use("/paper_decision/false", decision)
app.use("/warning", warning)
app.use("/getcolor", color)
app.use("/finalized", finalized)

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });


