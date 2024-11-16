const express = require("express");
const cors = require("cors");
const db = require("../connect");
const path = require("path");
const eventsRoute = express.Router();
const multer = require("multer");

eventsRoute.use(cors());
eventsRoute.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) =>  {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage:storage });
eventsRoute.use(express.json());
eventsRoute.use("/images", express.static(path.join(__dirname, "public/images")));

eventsRoute.get("/read", (req, res) => {
  const sql = "SELECT * FROM specialevents WHERE startDate >= CURRENT_DATE ORDER BY startDate";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json({ result });
  });
});

// Route to add a new special event
eventsRoute.post('/create', upload.single("image"), (req, res) => {
  const {
    eventName,
    eventType,
    startDate,
    endDate,
  } = req.body;
  const imageFileName = req.file ? req.file.filename : under-construction.webp;

  // Basic validation
  if (!eventName || eventType === undefined || !startDate || !endDate) {
    return res.status(400).json({ error: "Event name, type, date, and start time are required." });
  }

  // Define SQL query for inserting a special event
  const query = `
    INSERT INTO specialevents (eventName, eventType, startDate, endDate, imageFileName)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Execute the query with the provided form data
  db.execute(query, [
    eventName,
    eventType,
    startDate,
    endDate,
    imageFileName
  ], (error, results) => {
    if (error) {
      console.error("Error inserting special event:", error);
      return res.status(500).json({ error: "Failed to insert special event" });
    }

    // Return success response with the new eventID
    res.status(201).json({ message: "Special event created successfully", eventID: results.insertId });
  });
});

eventsRoute.delete('/:id', (req, res) => {
  db.query('DELETE FROM SpecialEvents WHERE eventID = ?', [req.params.id], (err) => {
      if (err) throw err;
  });
});

eventsRoute.put('/:id', (req, res) => {
  const { eventName, eventType, startDate, endDate } = req.body;
  db.query(
      'UPDATE SpecialEvents SET eventName = ?, eventType = ?, startDate = ?, endDate = ? WHERE eventID = ?',
      [eventName, eventType, startDate, endDate, req.params.id],
      (err) => {
          if (err) throw err;
       //   res.redirect('/events');
      }
  );
});

eventsRoute.get("/upcoming-events", (req, res) => {
  const query = `
      SELECT eventName, eventType, startDate, endDate
      FROM SpecialEvents
      WHERE startDate > NOW()
      ORDER BY startDate ASC
      LIMIT 5
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching upcoming events:", err);
          res.status(500).send("Error fetching upcoming events");
      } else {
          res.json(results);
      }
  });
});

eventsRoute.get("/upcoming-maintenance", (req, res) => {
  const query = `
      SELECT m.maintenanceID, r.rideName, e.Fname as technician,  m.maintenanceOpenDate as maintenanceDate, m.maintenanceStatus as status
      FROM maintenance AS m
      INNER JOIN rides AS r ON m.rideID = r.rideID
	    INNER JOIN employee AS e ON e.Ssn = r.technician
      WHERE m.maintenanceOpenDate > NOW()
      ORDER BY m.maintenanceOpenDate ASC
      LIMIT 5
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching upcoming maintenance:", err);
          res.status(500).send("Error fetching upcoming maintenance");
      } else {
          res.json(results);
      }
  });
});



module.exports = eventsRoute;

