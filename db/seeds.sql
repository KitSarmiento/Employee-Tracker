-- Department table  --
INSERT INTO department (name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Human Resources'),
        ('Legal'),
        ('Sales');

-- Roles --
INSERT INTO role (title, salary, department_id)
VALUES  ('Director of Engineer', 115000, 1),
        ('Lead Engineer', 85000, 1),
        ('Accountant', 95000, 2),
        ('Finance Staff', 80000, 2),
        ('Human Resources Staff', 93000, 3),
        ('Corporate Lawyer', 155000, 4),
        ('Lead Legal Team', 90000, 4),
        ('Customer Service', 75000, 5);

-- Employee Table --
