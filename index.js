const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
require('dotenv').config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.db_password,
    database: "employees_db"
});

//   This creates the connection with the database and informs us of the ID we are connected through
connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id: " + connection.threadId)
    // This also run the starter prompt to begin the user questions
    starterPrompt();
});

// First prompt when application starts

function starterPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome to the Employee Tracker - What would you like to do first?",
            name: "choice",
            choices: [
                "View All Employees",
                "View Employees by Role",
                "View Employees by Department",
                "Update an Employee",
                "Add an Employee",
                "Add a Role",
                "Add a Department",
                "Exit Application"
            ]
        }
    ]).then(function (data) {
        switch (data.choice) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View Employees by Role":
                viewByRoles();
                break;
            case "View Employees by Department":
                viewByDept();
                break;

            case "Update an Employee":
                updateEmployee();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add a Department":
                addDept();
                break;

            case "Exit Application":
                exitApp();
                break;

        }
    })
}
// Function to run view all employees
function viewAllEmployees() {
    console.log("view all employees")
     connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
         function (err, res) {
             console.log("view all employees")
             if (err) throw err
             console.table(res)
             starterPrompt()
         })
 }
 // This function will show all of the employees and their roles
 function viewByRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            starterPrompt()
        })
}
// This function runs to show the department the employee is from
function viewByDept() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            starterPrompt()
        })
}



// We use the below to allow the user to select from the list later on, it also keeps an empty array for us to push the user inputs too
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

// We use the below to allow the user to select from the list later on, it also keeps an empty array for us to push the user inputs too
var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}