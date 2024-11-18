const express = require("express");
const cors = require("cors");
const db = require("../connect");

const parkStatusRoute = express.Router();

parkStatusRoute.use(cors());
parkStatusRoute.use(express.json());

parkStatusRoute.post("/create", (req, res) => {
  const {
    date,
    weatherType,
  } = req.body;
  const query =
    "INSERT INTO parkstatus (date, weatherType) VALUES (?,?)";
  db.execute(
    query,
    [
      date,
      weatherType,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting into parkstatus", error);
        return res.status(500).json({ error: "Failed to insert park day" });
    }
    });
});
parkStatusRoute.get("/read", (req, res) => {
  const sql = "SELECT * from parkstatus WHERE date >= CURRENT_DATE";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json({ result });
  });
});

parkStatusRoute.get("/read/:parkStatusID", (req, res) => {
  const { parkStatusID } = req.params;
  const sql = "SELECT * from parkstatus where parkStatusID = ?;";
  db.query(sql, [parkStatusID], (err, result) => {
    if (err) console.log(err);
    res.json({ result });
  });
});

parkStatusRoute.put("/:id", (req, res) => {
  const {
    date,
    weatherType,
    parkStatusID
  } = req.body;
  const query = `UPDATE parkstatus SET date=?, weatherType=? WHERE parkStatusID = ?;`;
  db.execute(query,
    [date, weatherType, parkStatusID,],
    (err, results) => {
      if (err) console.log(err);
      res.send("row updated");
    }
  );
});

parkStatusRoute.get("/readhistory", (req, res) => {
    const sql = "SELECT * from parkstatus WHERE date <= CURRENT_DATE LIMIT 50";
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
        }
        res.json({ result });
    });
});

module.exports = parkStatusRoute;
