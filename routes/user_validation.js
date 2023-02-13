const express = require("express");
const router = express.Router();

const {validation} = require("../controllers/Validation");

router.get("/", validation);


module.exports = router;