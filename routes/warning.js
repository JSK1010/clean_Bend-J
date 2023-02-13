const express = require("express");
const router = express.Router();

const {warning} = require("../controllers/Updates");

router.get("/:id", warning);


module.exports = router;