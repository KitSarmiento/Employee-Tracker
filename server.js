const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

function mainTracker() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update Employee Role",
          "Remove an employee",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addADepartment();
          break;

        case "Add a role":
          addARole();
          break;

        case "Add an employee":
          addAnEmployee();
          break;

        case "Update Employee Role":
          updateAEmployeeRole();
          break;

        case "Remove an employee":
          removeAnEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// Function to view all employees
function viewAllEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id",
    function (err, result, fields) {
      if (err) {
        console.error("Error viewing employees: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}

// Function to view all roles
function viewAllRoles() {
  db.query(
    "SELECT role.id, role.title FROM role",
    function (err, result, fields) {
      if (err) {
        console.error("Error viewing roles: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}

function viewAllDepartments() {
  db.query(
    "SELECT department.id, department.name FROM department",
    function (err, result, fields) {
      if (err) {
        console.error("Error viewing departments: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}
