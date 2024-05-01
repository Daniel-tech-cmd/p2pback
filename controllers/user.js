const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Trade = require("../models/trade");

const Passwordrec = require("../models/passwordrec");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "365d" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    try {
      const lowercaseEmail = email.toLowerCase();
      user = await User.login(lowercaseEmail, password);
      if (!user) {
        return res.status(400).json({ error: error.message });
      }
      const dat = await User.findById(user._id);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = createToken(user._id);

    user.token = token;

    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password, username, country, number, role } = req.body;
  try {
    let user;

    const lowercaseEmail = email.toLowerCase();

    user = await User.signup(
      lowercaseEmail,
      password,
      username,
      role
      // country,
      // number
    );
    const token = createToken(user._id);
    user.token = token;

    try {
      const html2 = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Henny+Penny&family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Henny+Penny&family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
            body {
              font-family: 'Jost', sans-serif;
              text-align: center;
              margin: 0;
              padding:15px;
              background:#1daad9;
            }
        body *{
          font-family:"Jost",arial;
        }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              background:#e5e5e5;
            }
        
            h1 {
              color: #333;
            }
        
            p {
              color: #666;
              margin-bottom: 20px;
            }
        
            a {
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              color: #fff;
              text-decoration: none;
              background-color: #3498db;
              border-radius: 5px;
            }
        
            a:hover {
              background-color: #2980b9;
            }
        
            b {
              color: #333;
            }
        
            img {
              max-width: 100%;
              height: auto;
              margin:auto;
            }
            .imgcont{
              display:flex;
              justify-content:center;
            }
            footer{
              background:#0066ff;
              color:#fff;
              text-align:center;
              padding:15px 0;
              margin-top:20px;
              height:fit-content;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
          <div class="imgcont"><img src="https://Supayroom.org/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
            
            <div>
            <p> <b>Sign up Notification</b> </p>

            <p> ${user.email} Sign up succesful! </p>
            
            
            <p></p>
            </div>
            <footer> &copy; 2024  Supayroom. All rights reserved.<footer>
          </div>
          
        </body>
        
        </html>
        `;
      const url = `
      
      ${user.email} Sign up succesful! 
        
        `;
      const html = `<!DOCTYPE html>
              <html lang="en">
              
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Henny+Penny&family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Henny+Penny&family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
                  body {
                    font-family: 'Jost', sans-serif;
                    text-align: center;
                    margin: 0;
                    padding:15px;
                    background:#1daad9;
                  }
              body *{
                font-family:"Jost",arial;
              }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    background:#e5e5e5;
                  }
              
                  h1 {
                    color: #333;
                  }
              
                  p {
                    color: #666;
                    margin-bottom: 20px;
                  }
              
                  a {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 10px 0;
                    color: #fff;
                    text-decoration: none;
                    background-color: #3498db;
                    border-radius: 5px;
                  }
              
                  a:hover {
                    background-color: #2980b9;
                  }
              
                  b {
                    color: #333;
                  }
              
                  img {
                    max-width: 100%;
                    height: auto;
                    margin:auto;
                  }
                  .imgcont{
                    display:flex;
                    justify-content:center;
                  }
                  footer{
                    background:#0066ff;
                    color:#fff;
                    text-align:center;
                    padding:15px 0;
                    margin-top:20px;
                    height:fit-content;
                  }
                </style>
              </head>
              
              <body>
                <div class="container">
                <div class="imgcont"><img src="https://Supayroom.org/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
                  
                  <div>
                  <h4>Sign up notification</h4>
                  <p> ${user.email} just signed up</p>
                  
                  
                  <p></p>
                  </div>
                  <footer> &copy; 2024  Supayroom. All rights reserved.<footer>
                </div>
                
              </body>
              
              </html>
              `;
      // if (req.body.reciept) {
      await sendEmail(user.email, "Sign Up", url, html2);
      // } else {
      await sendEmail("support@supayroom.com", "sign up", url, html);
      // }
    } catch (error) {
      console.log(error);

      return res.status(404).json({ error: "failed to update" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyuser = async (req, res) => {
  const userid = req.params.id;
  const usertoken = req.params.token;
  const user = await User.findById(userid);
  if (!user) {
    return res.status(404).json({ error: "Invalid link" });
  }
  let token;
  try {
    token = await Token.findOne({
      userId: userid,
    });
    if (token?.token !== usertoken) {
      return res.status(404).json({ error: "Invalid link" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Invalid link" });
  }

  if (!token) {
    return res.status(404).json({ error: "Invalid link" });
  }
  user.verified = true;
  const user3 = await User.findByIdAndUpdate(
    { _id: userid },
    {
      ...user,
    },
    { new: false }
  );

  await Token.findByIdAndDelete({ _id: token._id });
  const token2 = createToken(user._id);
  let user2 = {};
  try {
    const masteradmin = await User.findOne({ role: "admin" });
    const url = `${user.email} just resgistered`;

    const html = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            text-align: center;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #333;
          }
      
          p {
            color: #666;
            margin-bottom: 20px;
          }
      
          a {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #fff;
            text-decoration: none;
            background-color: #3498db;
            border-radius: 5px;
          }
      
          a:hover {
            background-color: #2980b9;
          }
      
          b {
            color: #333;
          }
      
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      
      <body>
        <div class="container">
          <img src="https://Supayroom.org/_next/image?url=%2Flogo.png&w=64&q=75" alt="Company Logo">
          <h1>Sign up</h1>
          <p>${user.email} just signed up!</p>
          <p>country : ${user.country}</p>
          <p>username : ${user.username}</p>
          <p>number : ${user.number}</p>
        </div>
      </body>
      
      </html>
      `;
    await sendEmail("support@Supayroom.org", "Sign Up", url, html);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  user2._id = user._id;
  user2.token = token2;
  return res.status(200).json(user2);
};

const getOneUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getAllUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

const getTrades = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "no such user!" });
  }
  try {
    let trades = [];

    for (const trade of user.trades) {
      const fetctrade = await Trade.findOne({ id: trade.id });
      trades.push(fetctrade);
    }
    return res.status(200).json(trades);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "error while gettin trades!" });
  }
};

const patch2 = async (req, res) => {
  const userid = req.params.id;
  const { data } = req.body;
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user2 = await User.findByIdAndUpdate(
      { _id: userid },
      {
        ...req.body,
      },
      { new: false }
    );
    if (!user2) {
      return res.status(404).json({ error: "failed to update" });
    }
    res.status(200).json(user2);
  } catch {
    return res.status(500).json({ error: "server error" });
  }
};
module.exports = {
  loginUser,
  // changepassword,
  signupUser,
  verifyuser,
  getOneUser,
  getTrades,
  patch2,
  // invest,
  getAllUsers,
  // verifypass,
  // forgetpasswprd,
};
