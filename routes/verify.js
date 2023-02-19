const express = require("express");
const router = express.Router();


const {verify} = require("../controllers/verify");

router.get("/:id", verify);

module.exports = router;

