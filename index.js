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
            message: "Welcome to the Employee Tracker - What would you like to do?",
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

// The below runs a function to add an employee using the info the user inputs
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (data) {
        var roleId = selectRole().indexOf(data.role) + 1
        var managerId = selectManager().indexOf(data.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: data.firstName,
                last_name: data.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(data)
                starterPrompt()
            })

    })
}


// The function below allows the user to enter a new department name to be added
function addDept() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                starterPrompt();
            }
        )
    })
}




// This function adds a new role for employees
function addRole() {
    connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;

    inquirer 
    .prompt([
        {
            name: "new_role",
            type: "input", 
            message: "What is the Title of the new role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of this position? (Enter a number)"
        },
        {
            name: "deptChoice",
            type: "rawlist",
            choices: function() {
                var deptArry = [];
                for (let i = 0; i < res.length; i++) {
                deptArry.push(res[i].name);
                }
                return deptArry;
            },
        }
    ]).then(function (answer) {
        let deptID;
        for (let j = 0; j < res.length; j++) {
            if (res[j].name == answer.deptChoice) {
                deptID = res[j].id;
            }
        }

        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.new_role,
                salary: answer.salary,
                department_id: deptID
            },
            function (err, res) {
                if(err)throw err;
                console.log("Your new role has been added!");
                starterPrompt();
            }
        )
    })
    })
    
}

// update an employees role 
const updateEmployee = () => {
    connection.query(
        "SELECT * FROM employee;",
        (err, res) => {
            if (err) throw err;
            console.log(res);
            inquirer.prompt([ 
                {
                    type: "rawlist",
                    message: "Please select the employee's last name:",
                    name: "lastName",
                    choices: () => {
                        var lastName = [];
                        for (var i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    }
                },
                {
                    type: "rawlist",
                    message: "Please select the employee's new role:",
                    name: "role",
                    choices: selectRole()
                }
            ]).then((value) => {
                var roleId = selectRole().indexOf(value.role) + 1;
                connection.query(`UPDATE employee SET role_id = ${roleId} WHERE last_name = ?`,
                    [value.lastName],
                    (err, res) => {
                        if (err) throw err;
                        console.log("The employee's role has been updated!");
                        console.table(res);
                        starterPrompt();
                    }
                )
            })
        })
}



function exitApp (){
console.log("Thank you for using Employee Tracker!")
    connection.end();
}