const express = require("express");

const app = express();

//authentication server
const auth = require("./routes/auth");

const employee = require("./routes/employee");

const parkstatus = require("./routes/parkstatus");

app.use("/admin", auth);
app.use("/employee", employee);
app.use("/parkstatus", parkstatus);

app.listen(3000, () => {
  console.log("server running");
});