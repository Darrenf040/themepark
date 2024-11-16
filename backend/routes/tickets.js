// tickets.js
const express = require("express");
const cors = require("cors");
const db = require("../connect");
const ticketRoute = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

ticketRoute.use(cors());
ticketRoute.use(express.json());

// Route to create a new customer and ticket
ticketRoute.post("/create", (req, res) => {
  const {
    Fname,
    Minitial,
    Lname,
    Age,
    phoneNumber,
    streetAddress,
    City,
    State,
    ZIP,
    Email,
    password,
    ticketType,
    startDate,
    expiryDate,
  } = req.body;

  // Validate required fields
  if (
    !Fname ||
    !Lname ||
    Age === undefined ||
    !phoneNumber ||
    !streetAddress ||
    !City ||
    !State ||
    !ZIP ||
    !Email ||
    !password ||
    ticketType === undefined ||
    !startDate ||
    !expiryDate
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const salt = 10;

 // Insert customer data into 'customers' table
  const customerQuery = `
    INSERT INTO customers (Fname, Minitial, Lname, Age, phoneNumber, streetAddress, City, State, ZIP, Email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  

  bcrypt.hash(password, salt, (err, hashPassword) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const pw = [hashPassword];
    
    
    db.execute(
    customerQuery,
    [
      Fname,
      Minitial || null,
      Lname,
      Age,
      phoneNumber,
      streetAddress,
      City,
      State,
      ZIP,
      Email,
      pw,
    ],
    (customerError, customerResults) => {
      if (customerError) {
        console.error("Error inserting customer:", customerError);
        return res.status(500).json({ error: "Failed to insert customer" });
      }

      // Since customerID is assigned via a trigger, retrieve it using the combination of unique fields
      // Assuming 'Email' is unique
      const getCustomerIDQuery = `
        SELECT customerID FROM customers WHERE Email = ?
      `;
      db.execute(getCustomerIDQuery, [Email], (idError, idResults) => {
        if (idError) {
          console.error("Error retrieving customerID:", idError);
          return res.status(500).json({ error: "Failed to retrieve customerID" });
        }

        if (idResults.length === 0) {
          return res.status(500).json({ error: "Customer not found after insertion" });
        }

        const customerID = idResults[0].customerID;

        // Now insert ticket data into 'ticket' table
        const ticketQuery = `
          INSERT INTO ticket (customerID, ticketType, startDate, expiryDate)
          VALUES (?, ?, ?, ?)
        `;

        db.execute(
          ticketQuery,
          [customerID, ticketType, startDate, expiryDate],
          (ticketError, ticketResults) => {
            if (ticketError) {
              console.error("Error inserting ticket:", ticketError);
              return res.status(500).json({ error: "Failed to insert ticket" });
            }

            // Return success response with the new ticketID
            res.status(201).json({
              message: "Ticket purchased successfully",
              ticketID: ticketResults.insertId,
            });
          }
        );
      });
    }
  );

  });



 

  
});

ticketRoute.post("login", (req, res) => {
  const sql =
    "SELECT customerID, Email, password FROM customers where Email=?;";
  db.query(sql, [req.body.email], (err, result) => {
    //sql query error
    if (err) return res.send("sql query error");

    //email doesnt exist
    if (!result[0]) {
      return res.json({ Response: "Email doesnt exist" });
    }
    //database stored password
    const { password } = result[0];
    const inputedPassword = req.body.password;
    //database stored id
    const { customerID } = result[0];

    //compare user inputted password to resulted query hash
    bcrypt.compare(inputedPassword, password, (err, result) => {
      if (err) return res.json({ Response: "Password compare error" });

      //user inputted wrong password
      if (!result) {
        return res.json({ Response: "Password not found" });
      }
      //customerID from sql query
      //create token for user
      const payload = {
        id: customerID,
        role: "Customer",
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.json({ auth: true, token: token });
    });
  });
});

module.exports = ticketRoute;
