const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const walletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },
    image: {
      url: String,
      public_id: String,
    },
    ico: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
