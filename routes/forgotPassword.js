const express = require("express");
const router = express.Router();


const {forgotPassword} = require("../controllers/forgotPassword");

router.post("/forgotPassword", forgotPassword);

module.exports = router;

