const express = require("express");
const cors = require("cors");
const db = require("../connect");
const shopsRoute = express.Router();

shopsRoute.use(cors());
shopsRoute.use(express.json());

shopsRoute.get("/read", (req, res) => {
  const sql = "SELECT * FROM shop where deleteStatus = 0";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json({ result });
  });
});

shopsRoute.get("/readRestaurants", (req, res) => {
  const sql = "SELECT * FROM shop WHERE shopType = 0 and deleteStatus = 0";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json({ result });
  });
});

shopsRoute.get("/readGiftShops", (req, res) => {
  const sql = "SELECT * FROM shop WHERE shopType = 1 and deleteStatus = 0";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json({ result });
  });
});

shopsRoute.post("/create", (req, res) => {
  const { shopName, location, shopType, shopDesc, imageFileName } = req.body;
  const query = "INSERT INTO shop (shopName, location, shopType, shopDesc, deleteStatus, imageFileName) VALUES (?, ?, ?, ?, 0, 'under-construction.webp')";
  db.query(query, [shopName, location, shopType, shopDesc], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Failed to create shop");
      }
      res.status(201).send("Shop created successfully");
  });
});

shopsRoute.put("/:shopID", (req, res) => {
  const { shopID } = req.params;
  const { shopName, location, shopType, shopDesc } = req.body;
  const query = `
      UPDATE shop 
      SET shopName = ?, location = ?, shopType = ?, shopDesc = ?
      WHERE shopID = ?`;
  db.query(query, [shopName, location, shopType, shopDesc, shopID], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Failed to update shop");
      }
      res.send("Shop updated successfully");
  });
});

shopsRoute.delete("/:shopID", (req, res) => {
  const { shopID } = req.params;
  const query = "update shop set deleteStatus = 1 WHERE shopID = ?";
  db.query(query, [shopID], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Failed to delete shop");
      }
      res.send("Shop deleted successfully");
  });
});

module.exports = shopsRoute;
