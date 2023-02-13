const express = require("express");
const router = express.Router();

const {done_signin} = require("../controllers/Auth");

router.post("/", done_signin);


module.exports = router;