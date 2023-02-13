const express = require("express");
const router = express.Router();

const {done_signup} = require("../controllers/Auth");

router.post("/", done_signup);


module.exports = router;
