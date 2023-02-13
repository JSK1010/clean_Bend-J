const express = require("express");
const router = express.Router();

const {comments} = require("../controllers/Upload");

router.get("/", comments);

module.exports = router;