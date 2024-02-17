const express = require("express");
const app = express.Router();
const employee = require("../controllers/employee");
const sessionMiddleware = require('../Libs/session');

// sessionMiddleware(),
 
app.get("/get_employee", employee.get_employee);
app.post("/create_employee", employee.create_employee);
app.put("/edit_employee/:uid", employee.edit_employee);
app.delete("/delete_employee/:uid", employee.delete_employee);
app.get("/filter_employee", employee.filter_employee);
 
 
module.exports = app;