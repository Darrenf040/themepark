const express = require("express");
const db = require("../connect");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const customerRoute = express.Router();

//parses data that comes into json format
customerRoute.use(express.json());
//allows cookies to be sent to request header
customerRoute.use(cookieParser());

const salt = 10;
customerRoute.put("/", (req, res) => {
  const sql = "UPDATE customers SET `password` = ?;";

  //changes our plain text password into encrypted password
  bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const pw = [hashPassword];
    db.query(sql, [pw], (err, sqlResult) => {
      if (err) return res.json({ Error: "Inserting data error in server" });
      return res.json({ Status: "Success" });
    });
  });
});
customerRoute.post("/login", (req, res) => {
  const sql =
    "SELECT customerID, Email, password FROM customers where Email=?;";
  //data is sql results
  db.query(sql, [req.body.email], async (err, result) => {
    //sql query error
    if (err) return res.send("sql query error");

    //email doesnt exist
    if (!result[0]) {
      return res.json({ Response: "Email doesnt exist" });
    }
    //database stored password
    const { password, customerID, Email } = result[0];
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
        customerID: customerID,
        role: "Customer",
        email: req.body.email,
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
    req.manualVerify = false; // Set this flag to false if no token is provided
    // res.json({ Verify: false }); // Return response immediately if no token
    return next();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        req.manualVerify = false; // Set this flag to false if there's an error verifying the token
        return res.json({ Verify: false }); // Return response immediately if token verification fails
      }
      req.manualVerify = true; // Set this flag to true if the user is verified
      req.user = decoded; // Attach the decoded user data to the request object
      next(); // Proceed to the next middleware/route handler
    });
  }
};
// @ts-ignore
customerRoute.get("/verify", verifyUser, (req, res) => {
  // @ts-ignore
  return res.json({ Verify: true, customer: req.user });
});
module.exports = { customerRoute, verifyUser };
