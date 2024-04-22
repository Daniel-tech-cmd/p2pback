const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const tradeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    buyer: {
      type: String,
      // required: true,
    },
    seller: {
      type: String,
      // required: true,
    },
    assettobuy: {
      type: Object,
      required: true,
      amount: {
        type: Number,
      },
      name: {
        type: String,
      },
    },
    assettosell: {
      type: String,
      required: true,
      amount: {
        type: Number,
      },
    },
    whopaysfee: {
      type: String,
      required: true,
    },
    buyerpayment: {
      type: String,
      enum: ["not", "pending", "approved"],
    },
    sellerpayment: {
      type: String,
      enum: ["not", "pending", "approved"],
    },
    sellingadress: {
      type: String,
      required: true,
    },
    buyingadress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Trade", tradeSchema);
