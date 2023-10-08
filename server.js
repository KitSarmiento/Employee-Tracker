const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");

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
    user: "root",
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
          "View all departments", // Acceptance Criteria
          "View all roles", // Acceptance Criteria
          "View all employees", // Acceptance Criteria
          "Add a department", // Acceptance Criteria
          "Add a role", // Acceptance Criteria
          "Add an employee", // Acceptance Criteria
          "Update Employee Role", // Acceptance Criteria
          "Update Employee Manager", //Bonus
          "View Employees by Manager", // Bonus
          "View Employees by Department", // Bonus
          "Delete department", //Bonus
          "Delete role", //Bonus
          "Delete employee", //Bonus
          "View Total Department Budget", // Bonus
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

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "View Employees by Manager":
          viewEmployeesByManager();
          break;

        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;

        case "Delete department":
          deleteDepartment();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Delete employee":
          deleteEmployee();
          break;

        case "View Total Department Budget":
          viewTotalDepartmentBudget();
          break;

        case "Exit":
          db.end();
          break;
      }
    });
}

// Function to view all employees
function viewAllEmployees() {
  db.query(
    "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager " +
      "FROM employee AS e " +
      "INNER JOIN role AS r ON e.role_id = r.id " +
      "LEFT JOIN employee AS m ON e.manager_id = m.id",
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
    "SELECT role.id, role.title, role.salary FROM role",
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
      //  confirm that manager_input exists and isn't null or undefined.
      const managerId =
        answers.manager_input && answers.manager_input.toLowerCase() === "n/a"
          ? null
          : parseInt(answers.manager_input);

      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answers.first_name, answers.last_name, answers.role_id, managerId],
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
  db.query(
    'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, role.id AS role_id, role.title AS current_role ' +
      "FROM employee " +
      "INNER JOIN role ON employee.role_id = role.id",
    (err, employees) => {
      if (err) {
        console.error("Error retrieving employee data: " + err);
        return;
      }

      const employeeChoices = employees.map((employee) => ({
        name: `${employee.employee_name} (Current Role: ${employee.current_role})`,
        value: employee.id,
      }));

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
          db.query("SELECT id, title FROM role", (err, roles) => {
            if (err) {
              console.error("Error retrieving roles: " + err);
              return;
            }
            const roleChoices = roles.map((role) => ({
              name: role.title,
              value: role.id,
            }));

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

function updateEmployeeManager() {
  db.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, employees) => {
      if (err) {
        console.error("Error retrieving employees: " + err);
        return;
      }

      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee to update their manager:",
            choices: employeeChoices,
          },
          {
            type: "number",
            name: "newManagerId",
            message: "Enter the new manager's employee ID:",
          },
        ])
        .then((answers) => {
          db.query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [answers.newManagerId, answers.employeeId],
            (err, result) => {
              if (err) {
                console.error("Error updating employee manager: " + err);
                return;
              }
              console.log("Employee manager updated successfully.");
              mainTracker();
            }
          );
        });
    }
  );
}

mainTracker();
