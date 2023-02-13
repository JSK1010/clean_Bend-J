const express = require("express");
const router = express.Router();

const {decision} = require("../controllers/Updates");

router.get("/", decision);

module.exports = router;