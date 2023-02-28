const express = require("express");
const router = express.Router();


const {newPassword} = require("../controllers/newPassword");

router.post("/", newPassword);

module.exports = router;

