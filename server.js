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
  inquirer.prompt(
    [
      {
        type: "List",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Update Employee Role",
          "Remove an employee",
          "Exit",
        ],
      },
    ].then((answers) => {
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
    })
  );
}
