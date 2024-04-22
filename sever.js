const cors = require("cors");

const mongoose = require("mongoose");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");

const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

app.use(express.json({ limit: "200mb" }));

const userRoutes = require("./routes/user");
const transact = require("./routes/transactroute");

require("dotenv").config();
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/transact", transact);

mongoose
  .connect(process.env.STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to db && listening to pport ${process.env.PORT}!!!`
      );
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
