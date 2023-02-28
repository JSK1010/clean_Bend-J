const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
  origin: '*'
}));

const fs = require('fs');

const fileUpload = require('express-fileupload');
app.use(fileUpload());


const check = require("./routes/check");
const signin = require("./routes/signin");
const signin_admin = require("./routes/signin_admin");

const user_validation = require("./routes/user_validation");
const comments = require("./routes/comments");
const upload_details = require("./routes/upload_details");
const reupload = require("./routes/reupload");
const getpdf = require("./routes/getpdf");
const getpdfinfos = require("./routes/getpdfinfos");
const decision = require("./routes/decision");
const warning = require("./routes/warning");
const color = require("./routes/color");
const finalized = require("./routes/finalized");
const mypdfinfo = require("./routes/mypdfinfo");
const paperapi = require("./routes/paperapi");
const verifygenerator = require("./routes/verifygen");
const verify = require("./routes/verify");
const forgotPasswordEmail = require("./routes/forgotPasswordEmail");
const newPassword = require("./routes/newPassword");


app.use("/check", check);
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
app.use("/mypdfinfo", mypdfinfo)
app.use("/paperapi", paperapi)

app.use("/verifygenerator", verifygenerator)
app.use("/verify", verify)
app.use("/forgotPasswordEmail", forgotPasswordEmail);
app.use("/newPassword", newPassword);


app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});


