const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
}

