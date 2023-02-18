const express = require("express");
const router = express.Router();

const {mypdfinfo} = require("../controllers/Getpdf");

router.get("/", mypdfinfo);


module.exports = router;