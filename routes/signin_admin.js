const express = require("express");
const router = express.Router();

const {admin_signup} = require("../controllers/Auth");

router.post("/", admin_signup);


module.exports = router;