const express = require("express");
const router = express.Router();

const {finalized} = require("../controllers/Updates");

router.get("/", finalized);


module.exports = router;