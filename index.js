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
