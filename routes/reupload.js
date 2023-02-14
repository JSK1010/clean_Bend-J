const express = require("express");
const router = express.Router();


const {reupload} = require("../controllers/Upload");

router.post("/", reupload);
module.exports = router;