const express = require("express");
const router = express.Router();

const {view} = require("../controllers/Paperview");

router.get("/", view);


module.exports = router;