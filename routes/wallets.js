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
router.patch("/deletewallet/:id", isAdmin, deletewallet);
router.get("/all", getall);

module.exports = router;