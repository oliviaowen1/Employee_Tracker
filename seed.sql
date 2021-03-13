USE employees_db;

SELECT * FROM department;
INSERT INTO department (name)
VALUES ('Sales');

INSERT INTO department (name)
VALUES ('Engineering'); 

INSERT INTO department (name)
VALUES('Finance');

INSERT INTO department (name)
VALUES ('Legal');

SELECT * FROM role;
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1); 

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 250000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ('Lawyer', 190000, 4);


SELECT * FROM employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Lauren', 'Meekison', 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Paul', 'Bernard-Hall', 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Chris', 'Nguyen', 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Chris', 'Pong', 6, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Johnny', 'Bodenbach', 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Leonard', 'Walter', 2, 1);