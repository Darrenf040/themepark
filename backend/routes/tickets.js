// tickets.js
const express = require("express");
const cors = require("cors");
const db = require("../connect");
const ticketRoute = express.Router();
const { verifyUser } = require("../routes/customerLogin");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

ticketRoute.use(express.json());
ticketRoute.use(cookieParser());

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
            return res
              .status(500)
              .json({ error: "Failed to retrieve customerID" });
          }

          if (idResults.length === 0) {
            return res
              .status(500)
              .json({ error: "Customer not found after insertion" });
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
                return res
                  .status(500)
                  .json({ error: "Failed to insert ticket" });
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

ticketRoute.post("/purchase-tickets", verifyUser, (req, res) => {
  //user doesnt have token so hes not logged in

  if (req.manualVerify == false) {
    return res.json({
      Response: "Login into customer account to purchase ticket",
    });
  }

  const { date, tickets } = req.body;

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Error starting transaction:", transactionErr);
      return res.status(500).send("Transaction error");
    }

    let queriesCompleted = 0; // To track completed queries
    let totalQueries = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );

    for (const ticket of tickets) {
      for (let i = 0; i < ticket.quantity; i++) {
        // Insert ticket
        db.query(
          `INSERT INTO ticket (customerID, ticketType, startDate, expiryDate) 
           VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 1 DAY))`,
          [req.user.customerID, ticket.type, date, date],
          (ticketErr, ticketResult) => {
            if (ticketErr) {
              return rollbackTransaction(
                res,
                "Error inserting ticket",
                ticketErr
              );
            }

            const ticketID = ticketResult.insertId;

            // Get parkStatusID
            db.query(
              `SELECT parkStatusID FROM parkstatus WHERE date = ? LIMIT 1`,
              [date],
              (statusErr, statusResult) => {
                if (statusErr) {
                  return rollbackTransaction(
                    res,
                    "Error fetching park status",
                    statusErr
                  );
                }

                const parkStatusID = statusResult[0]?.parkStatusID;
                if (!parkStatusID) {
                  return rollbackTransaction(
                    res,
                    "Park status not found for the visit date"
                  );
                }

                // Insert into visit table and get VisitID
                db.query(
                  `INSERT INTO visit (CustomerID, ticketID, Date, parkStatusID)
                   VALUES (?, ?, ?, ?)`,
                  [req.user.customerID, ticketID, date, parkStatusID],
                  (visitErr, visitResult) => {
                    if (visitErr) {
                      return rollbackTransaction(
                        res,
                        "Error inserting into visit table",
                        visitErr
                      );
                    }

                    const visitID = visitResult.insertId;

                    console.log(`VisitID: ${visitID} successfully inserted.`);

                    queriesCompleted++;

                    // Check if all queries are done
                    if (queriesCompleted === totalQueries) {
                      db.commit((commitErr) => {
                        if (commitErr) {
                          return rollbackTransaction(
                            res,
                            "Error committing transaction",
                            commitErr
                          );
                        }

                        res.json({
                          Response: `Tickets purchased successfully! ${req.user.email}`,
                        });
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    }
  });

  // Helper function for rolling back transactions
  function rollbackTransaction(res, message, error = null) {
    db.rollback(() => {
      console.error(message, error);
      res.status(500).send(message);
    });
  }
});

module.exports = ticketRoute;
