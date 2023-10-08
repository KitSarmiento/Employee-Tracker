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
    password: "radiantSeaside8!",
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
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
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
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the department name:",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answers.name],
        (err, result) => {
          if (err) {
            console.error("Error adding department: " + err);
            return;
          }
          console.log("Department added successfully.");
          mainTracker();
        }
      );
    });
}

function addRole() {
  // You can prompt the user for role details like title, salary, and department_id here
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title:",
      },
      {
        type: "number",
        name: "salary",
        message: "Enter the role salary:",
      },
      {
        type: "number",
        name: "department_id",
        message: "Enter the department ID for this role:",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answers.title, answers.salary, answers.department_id],
        (err, result) => {
          if (err) {
            console.error("Error adding role: " + err);
            return;
          }
          console.log("Role added successfully.");
          mainTracker();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
      {
        type: "number",
        name: "role_id",
        message: "Enter the employee's role ID:",
      },
      {
        type: "input",
        name: "manager_input",
        message:
          "Enter the employee's manager ID (if applicable, Otherwise type N/A):",
      },
    ])
    .then((answers) => {
      // Check if manager_input exists and is not null or undefined before using toLowerCase()
      const managerId =
        answers.manager_input && answers.manager_input.toLowerCase() === "n/a"
          ? null
          : parseInt(answers.manager_input);

      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          managerId, // Use the converted value
        ],
        (err, result) => {
          if (err) {
            console.error("Error adding employee: " + err);
            return;
          }
          console.log("Employee added successfully.");
          mainTracker();
        }
      );
    });
}

function updateEmployeeRole() {
  // First, retrieve the list of employees and their roles from the database
  db.query(
    'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, role.id AS role_id, role.title AS current_role ' +
      "FROM employee " +
      "INNER JOIN role ON employee.role_id = role.id",
    (err, employees) => {
      if (err) {
        console.error("Error retrieving employee data: " + err);
        return;
      }

      // Create an array of employee choices for the inquirer prompt
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.employee_name} (Current Role: ${employee.current_role})`,
        value: employee.id,
      }));

      // Prompt the user to select an employee
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee to update their role:",
            choices: employeeChoices,
          },
        ])
        .then((employeeAnswer) => {
          // Next, retrieve the list of roles from the database
          db.query("SELECT id, title FROM role", (err, roles) => {
            if (err) {
              console.error("Error retrieving roles: " + err);
              return;
            }

            // Create an array of role choices for the inquirer prompt
            const roleChoices = roles.map((role) => ({
              name: role.title,
              value: role.id,
            }));

            // Prompt the user to select a new role for the employee
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "newRoleId",
                  message: "Select the new role for the employee:",
                  choices: roleChoices,
                },
              ])
              .then((roleAnswer) => {
                // Update the employee's role in the database
                db.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [roleAnswer.newRoleId, employeeAnswer.employeeId],
                  (err, result) => {
                    if (err) {
                      console.error("Error updating employee role: " + err);
                      return;
                    }
                    console.log("Employee role updated successfully.");
                    mainTracker();
                  }
                );
              });
          });
        });
    }
  );
}

mainTracker();
