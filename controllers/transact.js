const User = require("../models/user");
const mongoose = require("mongoose");
const Trade = require("../models/trade");

const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateRandomString = () => {
  const characters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(new Uint8Array(6));

  const generatedString = Array.from(randomBuffer)
    .map((byte) => characters[byte % characters.length])
    .join("");

  return generatedString;
};

const deposit = async (req, res) => {
  const { amount, method } = req.body;
  const userId = req.params.id;

  // let lenth = 0
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.deposit[user.deposit.length] = {
      amount: amount,
      status: "pending",
      method: method,
      date: Date.now(),
      index: user.deposit.length,
    };
    user.transaction[user.transaction.length] = {
      text: `deposit of ${amount}`,
      type: "deposit",
      date: Date.now(),
      status: "pending",
    };
    try {
      const masteradmin = await User.findOne({ role: "admin" });
      masteradmin.notifications[masteradmin.notifications.length] = {
        text: `${user.email} deposited $${amount}`,
        type: "deposit",
        date: Date.now(),
        userid: user._id,
        index: user.deposit.length - 1,
        id: generateRandomString(),
        amount: amount,
        method: method,
      };

      const adminupdate = await User.findByIdAndUpdate(
        { _id: masteradmin._id },
        {
          ...masteradmin,
        },
        { new: false }
      );
      if (!adminupdate) {
        return res.status(404).json({ error: "failed" });
      }
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
            <div class="imgcont"><img src="https://ozfront.vercel.app/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
              
              <div>
              <p> ${user.email} made a deposit request of ${amount}  via ${method} </p>
              <p><b>Details of your Deposit :<b/></p>
              <p>Amount : ${amount} USD
              <p>Charge: 0.0000 USD</p>
              <p>Asset : ${method} </p>
              
              
              <p></p>
              </div>
              <footer> &copy; 2024  PeakFund. All rights reserved.<footer>
            </div>
            
          </body>
          
          </html>
          `;
        const url = `
        
          ${user.email} made a deposit request of ${amount} USD via ${method} .
          
          Details of your Deposit :
          
          Amount : ${amount} USD
          
          Charge: 0.0000 USD
          
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
                  <div class="imgcont"><img src="https://ozfront.vercel.app/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
                    
                    <div>
                    <p> ${user.email} made a deposit request of ${amount} USD via ${method} </p>
                    <p><b>Details of your Deposit :<b/></p>
                    <p>Amount : ${amount} USD
                    <p>Charge: 0.0000 USD</p>
                    
                    
                    <p></p>
                    </div>
                    <footer> &copy; 2024  PeakFund. All rights reserved.<footer>
                  </div>
                  
                </body>
                
                </html>
                `;
        if (req.body.reciept) {
          await sendEmail("support@peakfund.org", "Deposit Request", url, html);
        } else {
          await sendEmail(
            "support@peakfund.org",
            "Deposit Request",
            url,
            html2
          );
        }
      } catch (error) {
        console.log(error);

        return res.status(404).json({ error: "failed to update" });
      }
      try {
        const user2 = await User.findByIdAndUpdate(
          { _id: userId },
          {
            ...user,
          },
          { new: false }
        );
        if (!user2) {
          return res.status(404).json({ error: "failed to update" });
        }
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "failed to update" });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "failed to update" });
    }
    try {
      const url = `Hello ${user.username}
  
            Your deposit request of ${amount}  via ${method} has been submitted successfully .
  
            Details of your Deposit :
  
            Amount : ${amount} USD
  
            Charge: 0.0000 USD

            Asset: ${method}
  
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
          <div class="imgcont"><img src="https://ozfront.vercel.app/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
            
            <div>
            <p>Hello ${user.username}<p>
            <p>Your deposit request of ${amount}   via  ${method} has been submitted successfully .</p>
            <p><b>Details of your Deposit :<b/></p>
            <p>Amount : ${amount} USD </p>
            <p>Asset : ${method}  </p>

            
            
            <p></p>
            </div>
            <footer> &copy; 2024  PeakFund. All rights reserved.<footer>
          </div>
          
        </body>
        
        </html>
        `;
      await sendEmail(user.email, "Deposit Request", url, html);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "failed to update" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "User not found" });
  }
};
async function isIdExists(id) {
  const t = await Trade.findOne({ id });
  if (t) {
    return true;
  } else {
    return false;
  }
}

const trade = async (req, res) => {
  const { buyer, seller, assettobuy, assettosell, whopaysfee } = req.body;
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let id = generateRandomString();

    while (await isIdExists(id)) {
      id = generateRandomString();
    }

    const trade = await Trade.create({ ...req.body, id });
    user.trades.push({ id: trade.id });
    const user1 = await User.findByIdAndUpdate(
      { _id: user._id },
      { ...user },
      { new: false }
    );
    return res.status(200).json(trade);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Internal server error" });
  }
};

const joinTrade = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const trade = await Trade.findOne({ id: req.body.id });
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }
    if (trade.buyer == user.username || trade.seller == user.username) {
      return res.status(200).json(trade);
    }
    if (trade.buyer == "") {
      trade.buyer = user.username;
    } else if (trade.seller == "") {
      trade.seller = user.username;
    }

    user.trades.push({ id: trade.id });
    const user1 = await User.findByIdAndUpdate(
      { _id: user._id },
      { ...user },
      { new: false }
    );
    const updatetrade = await Trade.findByIdAndUpdate(
      { _id: trade._id },
      {
        ...trade,
      },
      { new: false }
    );
    return res.status(200).json(updatetrade);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "No such trade" });
  }
};

const checkTrade = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const trade = await Trade.findOne({ id: req.body.id });
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }
    if (trade.buyer !== "" && trade.seller !== "") {
      return res.status(404).json({
        error: "Both parties have joined this trade room. no room for you!.",
      });
    }
    return res.status(200).json(trade);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Trade not found!" });
  }
};
const allTrade = async (req, res) => {
  const trade = await Trade.find({}).sort({ createdAt: -1 });
  res.status(200).json(trade);
};
const approvedeposit = async (req, res) => {
  // const userid = req.params.id;
  const { index, amount, userid, id, method } = req.body;

  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      user.deposit[index].status === "approved" ||
      user.deposit[index].status === "declined"
    ) {
      return res
        .status(404)
        .json({ error: `Request already ${user.deposit[index].status}` });
    }
    // const deposit = user.deposit;
    (user.deposit[index].status = "approved"),
      (user.transaction[user.transaction.length] = {
        text: `deposit of ${amount} ${method} approved`,
        type: "deposit",
        date: Date.now(),
        status: "approved",
      });
    try {
      const admin = await User.findOne({ role: "admin" });
      const index = admin.notifications.findIndex(
        (obj) => JSON.stringify(obj) === JSON.stringify(req.body)
      );

      const array = admin.notifications.filter(
        (item) => item.id !== req.body.id
      );
      admin.notifications = array;
      // admin.notifications.splice(index, 1);
      const admin2 = await User.findByIdAndUpdate(
        { _id: admin._id },
        {
          ...admin,
        },
        { new: false }
      );
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "Request already approved" });
    }
    try {
      const url = `Hello ${user.username}

      Your deposit request of ${amount} ${method}    has been approved.

          Details of your Deposit :

          Amount : ${amount} ${method}

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
        <div class="imgcont"><img src="https://ozfront.vercel.app/_next/image?url=%2Flogo.png&w=96&q=75" alt="Company Logo" ></div>
          
          <div>
          <p>Hello ${user.username}<p>
          <p>Your deposit request of ${amount} ${method}    has been approved .</p>
          <p><b>Details of your Deposit :<b/></p>
          <p>Amount : ${amount} 
          <p>Asset : ${method}
          <p>Charge: 0.0000 USD</p>
          
          
          <p></p>
          </div>
          <footer> &copy; 2024  PeakFund. All rights reserved.<footer>
        </div>
        
      </body>
      
      </html>
      `;
      await sendEmail(user.email, "Deposit Request", url, html);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "failed to update" });
    }

    // user.balance = Number(user.balance) + Number(amount);

    user.assets.push({
      amount: amount,
      name: method,
    });

    try {
      const user2 = await User.findByIdAndUpdate(
        { _id: userid },
        {
          ...user,
        },
        { new: false }
      );
      if (!user2) {
        return res.status(404).json({ error: "failed to update" });
      }
      res.status(200).json(user2);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "failed to update" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "failed to update" });
  }
};
module.exports = {
  deposit,
  trade,
  joinTrade,
  allTrade,
  approvedeposit,
  checkTrade,
};
