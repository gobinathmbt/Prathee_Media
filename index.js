//ExpressJS Requirments
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));



const config = require("./config/environment/dbDependencies");
const serverConfig = require("./config/environment/serverConfig");
const port = process.env.PORT || serverConfig.ServerPort;


const user = require("./src/routes/users")
const employee = require("./src/routes/employee")


mongoose
.connect(config.dbURL)
.then(() => {console.log("Connected to MongoDB");})
.catch((err) => {console.error("MongoDB connection error:", err);});



//MiddleWares
app.use(user);
app.use(employee);

//Middleware for health check
app.use("/api/v1/health", async (req, res) => {
  try {await mongoose.connection.db.command({ ping: 1 });res.json({status: "Database is healthy",health: "API Server is up & running",});
  } catch (error) {console.error("Database is not healthy:", error);res.status(500).json({ status: "Database is not healthy", error: error.message });}
});



app.listen(port, () => {
  console.log("CONNECT Server is running on http://localhost: " + port);
});



