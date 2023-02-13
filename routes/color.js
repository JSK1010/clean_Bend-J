const express = require("express");
const router = express.Router();

const {color} = require("../controllers/Updates");

router.get("/", color);


module.exports = router;