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
// Prompt for the user to select the database they would like to select
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
          "View Total Department Budget", // Bonus
          "Delete item", //Bonus -  combine the delete function for department, role or employee
          "Exit",
        ],
      },
    ])

    //switch statement for the user to select the database they would like to select
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

        case "View Total Department Budget":
          viewTotalDepartmentBudget();
          break;

        case "Delete item": // Bonus -  combine the delete function for department, role or employee
          deleteItem();
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
// Function to view the departments.
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

// Function to add a department
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

// Function to add a role
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

// Function to add an employee
// Prompt for the user to enter the employee's first name, last name, role ID, and manager
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

      // Prompt to allow the user to update the employee's role
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

// Function to update an employee's manager
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

      // Prompt to allow the user to update the employee's manager
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

// Function to view all employees by manager
function viewEmployeesByManager() {
  db.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name " +
      "FROM employee e " +
      "LEFT JOIN employee m ON e.manager_id = m.id",
    (err, result) => {
      if (err) {
        console.error("Error viewing employees by manager: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}

// Function to display employees by their department
function viewEmployeesByDepartment() {
  db.query(
    "SELECT d.name AS department_name, e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.title AS job_title, r.salary " +
      "FROM department d " +
      "INNER JOIN role r ON d.id = r.department_id " +
      "INNER JOIN employee e ON r.id = e.role_id",
    (err, result) => {
      if (err) {
        console.error("Error viewing employees by department: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}

// Function to view total budget of all departments
// For the database query. I added a SUM function to calculate the total budget for each department.
function viewTotalDepartmentBudget() {
  db.query(
    "SELECT d.name AS department_name, SUM(r.salary) AS total_budget " +
      "FROM department d " +
      "INNER JOIN role r ON d.id = r.department_id " +
      "GROUP BY d.name",
    (err, result) => {
      if (err) {
        console.error("Error viewing total department budget: " + err);
        return;
      }
      console.table(result);
      mainTracker();
    }
  );
}

// Delete function was based on the add function above and modified some of the functions to delete data from the database.
// Function to delete a department, role, or employee
function deleteItem() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "itemType",
        message: "Select the type of item to delete:",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((typeAnswer) => {
      const itemType = typeAnswer.itemType.toLowerCase();

      let tableName;
      let deleteType;
      let promptMessage;

      switch (itemType) {
        case "department":
          tableName = "department";
          deleteType = "Department";
          promptMessage = `Enter the ID of the ${deleteType} you want to delete:`;
          break;
        case "role":
          tableName = "role";
          deleteType = "Role";
          promptMessage = `Enter the ID of the ${deleteType} you want to delete:`;
          break;
        case "employee":
          tableName = "employee";
          deleteType = "Employee";
          promptMessage = `Enter the ID of the ${deleteType} you want to delete:`;
          break;
        default:
          console.error("Invalid item type.");
          mainTracker();
          return;
      }

      inquirer
        .prompt([
          {
            type: "input",
            name: "itemId",
            message: promptMessage,
          },
        ])
        .then((answers) => {
          const query = `DELETE FROM ${tableName} WHERE id = ?`;

          db.query(query, [answers.itemId], (err, result) => {
            if (err) {
              console.error(`Error deleting ${deleteType}: ` + err);
              return;
            }
            console.log(`${deleteType} deleted successfully.`);
            mainTracker();
          });
        });
    });
}

mainTracker();
