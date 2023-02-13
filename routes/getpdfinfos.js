const express = require("express");
const router = express.Router();

const {infos} = require("../controllers/Getpdf");

router.get("/", infos);


module.exports = router;