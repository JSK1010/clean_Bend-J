const express = require("express");
const router = express.Router();

const {check} = require("../controllers/Auth");

router.get("/", check);


module.exports = router;