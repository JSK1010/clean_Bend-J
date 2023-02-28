const express = require("express");
const router = express.Router();


const {forgotPasswordEmail} = require("../controllers/forgotPasswordEmail");

router.post("/", forgotPasswordEmail);

module.exports = router;

