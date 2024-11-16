// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require("multer");

// Import route modules
const auth = require("./routes/auth");
const employee = require("./routes/employee");
const parkstatus = require("./routes/parkstatus");
const events = require("./routes/events");
const rides = require("./routes/rides");
const shops = require("./routes/shops");
const employeeAuth = require("./routes/employeeAuth");
const tickets = require("./routes/tickets");
const adminTickets = require("./routes/adminTickets");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// **CORS Configuration**
app.use(
  cors({
    origin: "https://gleaming-lokum-158537.netlify.app/", // Update this to match your frontend's origin
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);

// Middleware
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/admin", auth);
app.use("/employee", employee);
app.use("/parkstatus", parkstatus);
app.use("/events", events);
app.use("/rides", rides);
app.use("/shops", shops);
app.use("/employees", employeeAuth);
app.use("/tickets", tickets);
app.use("/adminTickets", adminTickets);

// Test Route
app.get("/", (req, res) => {
  res.send("CORS-enabled for specified domain");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
