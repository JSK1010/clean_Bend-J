const express = require("express");
const router = express.Router();

const {getpdf} = require("../controllers/Getpdf");

router.get("/:id", getpdf);


module.exports = router;