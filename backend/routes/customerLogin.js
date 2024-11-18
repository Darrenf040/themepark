

const express = require("express");
const db = require("../connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const customerRoute = express.Router();

// Parses incoming JSON requests
customerRoute.use(express.json());
// Allows cookies to be sent in request headers
customerRoute.use(cookieParser());
// Configure CORS


// Secret key for JWT (make sure to set this in your environment variables)
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "your_jwt_secret_key";

// Salt rounds for bcrypt
const saltRounds = 10;

// Middleware to verify JWT token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  }
};

// Route to register a new customer
customerRoute.post("/register", (req, res) => {
  const {
    Email,
    password,
    Fname,
    Lname,
    Age,
    phoneNumber,
    streetAddress,
    City,
    State,
    ZIP,
    Minitial, // Optional
  } = req.body;

  // Validate required fields
  if (
    !Email ||
    !password ||
    !Fname ||
    !Lname ||
    !Age ||
    !phoneNumber ||
    !streetAddress ||
    !City ||
    !State ||
    !ZIP
  ) {
    return res.status(400).json({ error: "All fields except Middle Initial are required." });
  }

  // Check if Email already exists
  const checkEmailQuery = "SELECT * FROM customers WHERE Email = ?";
  db.query(checkEmailQuery, [Email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Error hashing password:", hashErr);
        return res.status(500).json({ error: "Server error" });
      }

      // Insert the new customer into the database
      const insertQuery = `INSERT INTO customers 
      (Email, password, Fname, Lname, Age, phoneNumber, streetAddress, City, State, ZIP, Minitial)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertQuery,
        [
          Email,
          hashedPassword,
          Fname,
          Lname,
          Age,
          phoneNumber,
          streetAddress,
          City,
          State,
          ZIP,
          Minitial || null, // Set to null if not provided
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Error inserting customer:", insertErr);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(201).json({ message: "Customer registered successfully" });
        }
      );
    });
  });
});

// Route to log in a customer
customerRoute.post("/login", (req, res) => {
  const { Email, password } = req.body;

  const query = "SELECT * FROM customers WHERE Email = ?";
  db.query(query, [Email], (err, results) => {
    if (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const customer = results[0];

    // Compare passwords
    bcrypt.compare(password, customer.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error("Error comparing passwords:", compareErr);
        return res.status(500).json({ error: "Server error" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Authentication successful, generate JWT token
      const token = jwt.sign({ customerID: customer.customerID }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Optionally, set the token as a cookie
      res.cookie("token", token, { httpOnly: true });

      // Send the token and customerID in the response
      res.json({ message: "Login successful", token, customerID: customer.customerID });
    });
  });
});

// Route to update customer password
customerRoute.put("/update-password", verifyUser, (req, res) => {
  const customerID = req.user.customerID;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required." });
  }

  // Hash the new password
  bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    const sql = "UPDATE customers SET password = ? WHERE customerID = ?";
    db.query(sql, [hashedPassword, customerID], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Password updated successfully" });
    });
  });
});

module.exports = customerRoute;
