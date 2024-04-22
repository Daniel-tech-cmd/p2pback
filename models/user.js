const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "username already exists"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "master admin"],
    },

    transaction: [
      {
        text: {
          type: String,
        },
        type: {
          type: String,
        },
        date: {
          type: Date,
        },
        status: {
          type: String,
        },
        id: {
          type: Number,
        },
      },
    ],
    withdraw: [
      {
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        wallet: {
          type: String,
        },
        method: {
          type: String,
        },
        date: {
          type: Date,
        },
        index: {
          type: Number,
        },
        transactid: {
          type: String,
        },
      },
    ],
    deposit: [
      {
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        method: {
          type: String,
        },
        date: {
          type: Date,
        },
        index: {
          type: Number,
        },
        transactid: {
          type: String,
        },
        reciept: {
          url: String,
          public_id: String,
        },
      },
    ],
    assets: [
      {
        amount: {
          type: Number,
        },

        name: {
          type: String,
        },

        index: {
          type: Number,
        },

        transactid: {
          type: String,
        },
      },
    ],

    balance: {
      type: Number,
      default: 0.0,
      // required: false,
    },
    country: {
      type: String,
    },

    number: {
      type: String,
    },

    referals: [
      {
        name: { type: String },
        id: { type: String },
      },
    ],
    profit: {
      type: Number,
      // required: false,
      default: 0.0,
    },
    minimumWithdrawal: {
      type: Number,
      default: 0.0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        text: {
          type: String,
        },
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        method: {
          type: String,
        },
        date: {
          type: Date,
        },
        userid: {
          type: String,
        },
        index: {
          type: Number,
        },
        id: {
          type: String,
        },
        type: {
          type: String,
        },
        reciept: {
          url: String,
          public_id: String,
        },
      },
    ],
    totalbalance: {
      type: Number,
    },
    invested: {
      type: Boolean,
      default: false,
    },
    amountinvested: {
      type: Number,
      default: 0,
    },
    zipcode: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password, username, role) {
  const emailExists = await this.findOne({ email });
  const userExists = await this.findOne({ username });
  if (!email || !password || !username) {
    throw Error("all fields must be filled!");
  }
  if (!validator.isEmail(email)) {
    throw Error("email is not valid!");
  }

  if (emailExists) {
    throw Error("email already in use!");
  }

  if (userExists) {
    throw Error("username already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    email,
    password: hash,
    role,
  });
  delete user._doc.password;
  const data = {
    ...user,
  };
  return data._doc;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("all fields must be filled!");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("no such user!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("incorrect password!");
  }
  delete user.password;
  const data = {
    ...user,
  };
  return data;
};
module.exports = mongoose.model("User", userSchema);
