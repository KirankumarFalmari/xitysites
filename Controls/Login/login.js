const express = require("express");
const route = express.Router();
const path = require("path");
// const jwt = require("jsonwebtoken");
require("../../Connection/connection");
const Register = require("../../Modules/Admin-users/admin-users");
const bodyparser = require("body-parser");

route.use(express.json());
route.use(bodyparser.json());
route.use(bodyparser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: false }));
// const static_path = path.join(__dirname, "../../Views/");

route.get("/", (req, res) => {
  if (req.cookies.jwtoken) {
    res.redirect("/directory/category/");
  } else {
    // res.sendFile(static_path + "login.ejs");
    res.render("login");
  }
});

route.post("/", async (req, res) => {
  try {
    const OTP = 111111;
    const pincode = req.body.pincode;
    const otp1 = req.body.otp1;
    const otp2 = req.body.otp2;
    const otp3 = req.body.otp3;
    const otp4 = req.body.otp4;
    const otp5 = req.body.otp5;
    const otp6 = req.body.otp6;

    let temp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    const otp = Number(temp);
    const userLogin = await Register.findOne({ phoneno: req.body.pno });
    // console.log(userLogin);
    if (Number(req.body.pno) === userLogin.phoneno) {
      if (otp === OTP) {
        if (pincode === userLogin.pincode) {
          //   req.session.user = true;
          const token = String(userLogin.tokens[0].token);

          res.cookie("jwtoken", token, { httpOnly: true });
          res.redirect("/directory/category/");
        }
      } else {
        console.log("Wrong otp");
      }
    } else {
      console.log("user is not registered");
    }
    // }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
