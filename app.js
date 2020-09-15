//jshint esversion:6

// ---- Instalacion de modulos y paquetes usados -------

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const saltRounds = 10;

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        bcrypt.compare(password, docs.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          } else {
            res.redirect("/login");
          }
        });
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server running and listening in port 3000");
});
