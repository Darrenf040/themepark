const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require("multer");

const auth = require("./routes/auth");
const employee = require("./routes/employee");
const parkstatus = require("./routes/parkstatus");
const events = require("./routes/events");
const rides = require("./routes/rides");
const maintenance = require("./routes/maintenance");
const shops = require("./routes/shops");
const employeeAuth = require("./routes/employeeAuth");
const tickets = require("./routes/tickets");
const adminTickets = require("./routes/adminTickets");
const reportsRoute = require("./routes/reports");
const customerRoute = require("./routes/customerLogin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/admin", auth);
app.use("/employee", employee);
app.use("/parkstatus", parkstatus);
app.use("/events", events);
app.use("/rides", rides);
app.use("/shops", shops);
app.use("/employees", employeeAuth);
app.use("/maintenance", maintenance);
app.use("/tickets", tickets);
app.use("/adminTickets", adminTickets);
app.use("/reports", reportsRoute);
app.use("/customer", customerRoute);

app.get(`/`, (req, res) => {
  res.send(`Cors-enabled for specified domain`);
});

app.listen(3000, () => {
  console.log("server running");
});
