const express = require("express");
const router = express.Router();
const {
  createwallet,
  updatewallet,
  getall,
  deletewallet,
} = require("../controllers/wallets");
const { isAdmin, auth } = require("../middleware/auth");
router.patch("/createwallet/:id", isAdmin, createwallet);
router.patch("/updatewallet/:id", isAdmin, updatewallet);
router.patch("/deletewallet/", deletewallet);
router.get("/allwallet", getall);

module.exports = router;
