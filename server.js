require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { v5: uuidv5 } = require("uuid");
const nocache = require("nocache");
const methodOverride = require("method-override");
const flash = require('express-flash')

const app = express();

app.set("view engine", "ejs");

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "uuidv5",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use("/", require("./routes/user"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
