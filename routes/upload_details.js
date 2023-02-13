const express = require("express");
const router = express.Router();

const {upload_details} = require("../controllers/Upload");

router.post("/", upload_details);


module.exports = router;