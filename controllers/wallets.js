const Wallets = require("../models/wallets");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

const createwallet = async (req, res) => {
  try {
    const walletexists = await Wallets.findOne({ name: req.body.name });
    let uploadedimg;
    let uploadedqr;
    if (walletexists) {
      try {
        try {
          let photo = await cloudinary.uploader.upload(req.body.ico, {
            folder: "p2p",
            width: "auto",
            crop: "fit",
          });
          if (photo) {
            uploadedimg = {
              public_id: photo.public_id,
              url: photo.url,
            };
          }

          let img = await cloudinary.uploader.upload(req.body.image, {
            folder: "p2p",
            width: "auto",
            crop: "fit",
          });
          if (img) {
            uploadedqr = {
              public_id: img.public_id,
              url: img.url,
            };
          }

          req.body.image = uploadedqr;
          req.body.ico = uploadedimg;
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "could not upload image" });
        }

        const updatewallet = await Wallets.findByIdAndUpdate(
          { _id: walletexists?._id },
          { ...req.body },
          { new: false }
        );
        return res.status(200).json(updatewallet);
      } catch (error) {
        return res.status(400).json({ error: "error during wallet update" });
      }
    }

    try {
      let photo = await cloudinary.uploader.upload(req.body.ico, {
        folder: "p2p",
        width: "auto",
        crop: "fit",
      });
      if (photo) {
        uploadedimg = {
          public_id: photo.public_id,
          url: photo.url,
        };
      }

      let img = await cloudinary.uploader.upload(req.body.image, {
        folder: "p2p",
        width: "auto",
        crop: "fit",
      });
      if (img) {
        uploadedqr = {
          public_id: img.public_id,
          url: img.url,
        };
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "could not upload image" });
    }
    req.body.image = uploadedqr;
    req.body.ico = uploadedimg;
    const wallet = await Wallets.create(req.body);
    return res.status(200).json(wallet);
  } catch (error) {
    // console.log(req.body);
    return res.status(500).json({ error: "Server error" });
  }
};

const deletewallet = async (req, res) => {
  const { id } = req.body;

  try {
    const deletewallet = await Wallets.findByIdAndDelete({ _id: id });
    return res.status(200).json(deletewallet);
  } catch (error) {
    return res.status(400).json({ error: "error during wallet delete" });
  }
};

const updatewallet = async (req, res) => {
  const { id } = req.body;

  try {
    const updatewallet = await Wallets.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: false }
    );
    return res.status(200).json(updatewallet);
  } catch (error) {
    return res.status(400).json({ error: "error during wallet update" });
  }
};

const getall = async (req, res) => {
  const wallets = await Wallets.find({}).sort({ createdAt: -1 });
  return res.status(200).json(wallets);
};

// const coins = [
//   {
//     name: "bitcoin",
//     id: "btc",
//     address: "bc1qzy3fzdywkxg88nhj77wtrr7nel6v3vql5mvmsa",
//     image: "/bitcoin.jpg",
//     ico: "/bitico.png",
//   },
//   {
//     name: "bnb smart chain",
//     id: "bnb smart chain",
//     address: "0x6A34D1C568EE40b98f53664ac534E84C46F2e50D",
//     image: "/bnb-smart-chain.jpg",
//     ico: "/bnbsmartico.png",
//   },
//   {
//     name: "bnb beacon chain",
//     id: "bnb beacon chain",
//     address: "bnb1tjwj6jcqhmmj0487thccva2nu7hwnkd5vt2ja8",
//     image: "/bnb-beacon-chain.jpg",
//     ico: "/bnbbeaconico.png",
//   },
//   {
//     name: "BCH",
//     id: "bch",
//     address: "qqvva8fugqha98tylyvhswk0vtd2ua0mrslzrwuzat",
//     image: "/bch.jpg",
//     ico: "/bchico.png",
//   },
//   {
//     name: "Litcoin",
//     id: "LTC",
//     address: "ltc1qtsge9h4etq86hglvte8563avtlg5f4k9kk6e5s",
//     image: "/litcoin.jpg",
//     ico: "/litcoinico.png",
//   },
//   {
//     name: "Doge",
//     id: "doge",
//     address: "DLWE8f35AAKLrqYqzaZcx7nCTAcoDnSWGf",
//     image: "/doge.jpg",
//     ico: "/dogeico.png",
//   },
//   {
//     name: "Xrp",
//     id: "xrp",
//     address: "r9h5gyw9Jk3H9k2WCbBrHDX6o4NaK4DUov",
//     image: "/xrp.jpg",
//     ico: "/xrpi.png",
//   },
//   {
//     name: "Kcs",
//     id: "kcs",
//     address: "0x6A34D1C568EE40b98f53664ac534E84C46F2e50D",
//     image: "/kcs.jpg",
//     ico: "/kcsico.png",
//   },
//   {
//     name: "Matic",
//     id: "matic",
//     address: "0x6A34D1C568EE40b98f53664ac534E84C46F2e50D",
//     image: "/matic.jpg",
//     ico: "/maticico.png",
//   },
// ];
// const mapcreate = async (req, res) => {
//   const wallets = [];
//   for (const trade of coins) {
//     console.log("here");
//     try {
//       const walletexists = await Wallets.findOne({ name: trade.name });

//       if (walletexists) {
//         return;
//       }

//       let uploadedimg = { url: trade.ico, public_id: "hjhdoisdidsjoio" };
//       let uploadedqr = { url: trade.image, public_id: "hjhdoisdidsjoio" };

//       trade.image = uploadedqr;
//       trade.ico = uploadedimg;
//       const wallet = await Wallets.create(trade);
//       wallets.push(wallet);
//     } catch (error) {
//       // console.log(req.body);
//       return res.status(500).json({ error: "Server error" });
//     }
//   }
//   return res.status(200).json(wallets);
// };
module.exports = {
  createwallet,
  deletewallet,
  updatewallet,
  getall,
};
