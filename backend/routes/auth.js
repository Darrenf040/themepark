const express = require("express");
const db = require("../connect");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express.Router();

//parses data that comes into json format
app.use(express.json());

app.use(cookieParser());

const salt = 10;
app.post("/create", (req, res) => {
  const sql = "INSERT INTO admin (`userName`, `password`) VALUES (?);";

  //changes our plain text password into encrypted password
  bcrypt.hash(req.body.password.toString(), salt, (err, hashPassword) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const values = [req.body.userName, hashPassword];
    db.query(sql, [values], (err, sqlResult) => {
      if (err) return res.json({ Error: "Inserting data error in server" });
      return res.json({ Status: "Success" });
    });
  });
});

//admin login post request
app.post("/", (req, res) => {
  const sql = "SELECT userName, password FROM admin where userName=?;";
  //data is sql results
  db.query(sql, [req.body.userName], async (err, result) => {
    //sql query error
    if (err) return res.send("sql query error");

    //username doesnt exist
    if (!result[0]) {
      //username doesnt exist
      return res.json({ Response: "Username doesnt exist" });
    }
    //database stored password
    const { password } = result[0];
    const inputedPassword = req.body.password;

    //compare user inputted password to resulted query hash
    bcrypt.compare(inputedPassword, password, (err, result) => {
      if (err) return res.json({ Response: "Password compare error" });

      //user inputted wrong password
      if (!result) {
        return res.json({ Response: "Password not found" });
      }

      //create token for user
      const payload = {
        userName: req.body.userName,
        role: "Admin",
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 86400000,
      });
      return res.json({ auth: true, token: token });
    });
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Verify: false });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.json({ Verify: false });
      req.user = decoded;
      next();
    });
  }
};

// @ts-ignore
app.get("/verify", verifyUser, (req, res) => {
  // @ts-ignore
  return res.json({ Verify: true, user: req.user });
});
// @ts-ignore
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.json({ Response: "Logged out Successfully" });
});

module.exports = app;
