const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    // MySQL username,
    user: "root",
    // MySQL password will be provided once upon submitting the assignment.
    password: "",
    database: "employeeTracker_db",
  },
  console.log(`Connected to the employeeTracker_db database.`)
);
