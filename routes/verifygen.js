const express = require("express");
const router = express.Router();


const {verifygenerator} = require("../controllers/verify");

router.post("/", verifygenerator);

module.exports = router;

