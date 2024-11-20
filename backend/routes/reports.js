const express = require("express");
const cors = require("cors");
const db = require("../connect");
const reportsRoute = express.Router();

reportsRoute.use(cors());
reportsRoute.use(express.json());

// Route 1: maintenance

reportsRoute.post("/maintenance", (req, res) => {
    const query = `
      SELECT 
  m.rideID,
  r.rideName,
  m.maintenanceStatus,
  DATE(m.maintenanceOpenDate) AS maintenanceOpenDate,
  DATE(m.maintenanceCloseDate) AS maintenanceCloseDate,
  r.technician,
  e.Fname,
  e.Lname
FROM 
  maintenance m
JOIN 
  rides r ON m.rideID = r.rideID
JOIN 
  employee e ON r.technician = e.Ssn
WHERE 
  (DATE(m.maintenanceOpenDate) >= ? AND DATE(m.maintenanceCloseDate) <= ?);
        
    `;
  
    db.query(query, [req.body.startDate, req.body.endDate], (err, result) => {
      if (err) return res.json({Error: err})
      return res.json({Result: result})
    })
  });
  
  // Route 2: Ticket Sales Data
  reportsRoute.post("/ticket-sales", async (req, res) => {
    const query = `
      SELECT 
    GROUP_CONCAT(t.ticketID) AS ticketIDs, 
    tt.ticketType,
    tt.ticketName,
    t.startDate,
    t.expiryDate,
    SUM(tt.ticketPrice) AS totalTicketPrice,
    LENGTH(GROUP_CONCAT(t.ticketID)) - LENGTH(REPLACE(GROUP_CONCAT(t.ticketID), ',', '')) + 1 AS ticketCount
FROM 
    ticket t
JOIN 
    tickettype tt ON t.ticketType = tt.ticketType
WHERE 
    t.startDate >= ? AND t.expiryDate <= ?  
    AND tt.ticketName = ?  
GROUP BY 
    tt.ticketType, 
    tt.ticketName, 
    t.startDate, 
    t.expiryDate
ORDER BY 
    t.startDate, 
    t.expiryDate;

    `;
  
    db.query(query, [req.body.startDate, req.body.expiryDate, req.body.ticketName, ], (err, result) => {
      if(err) return res.json({Error:err})
        console.log(result)
        console.log(req.body)
        return res.json({Result: result})
    })
  });
  

    // Route 5:Refund
    reportsRoute.post("/refund-info",  (req, res) => {
    const query = `
    SELECT 
    t.ticketID,
    tt.ticketName,
    t.customerID,
    c.Fname,
    c.Lname,
    c.phoneNumber,
    c.Email,
    t.startDate,
    t.expiryDate
FROM 
    ticket t
JOIN 
    customers c
ON 
    t.customerID = c.customerID
JOIN 
    ticketType tt
ON 
    t.ticketType = tt.ticketType
WHERE 
t.ticketType = 5 and 4
AND t.startDate >= ?
AND t.expiryDate <= ?;
     `;
    db.query(query, [req.body.startDate, req.body.expiryDate], (err, result) => {
      if(err) return res.json({Error:err})
        console.log(result)
        console.log(req.body)
        return res.json({Result: result})
    })
  });
  module.exports = reportsRoute;
