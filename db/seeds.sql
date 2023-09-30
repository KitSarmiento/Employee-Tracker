-- Department table  --
INSERT INTO department (name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Human Resources'),
        ('Legal'),
        ('Sales');

-- Role table --
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
INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Emily', 'Johnson', 1),
        ('Daniel', 'Smith', 2),
        ('Sophia', 'Brown', 3),
        ('William', 'Davis', 4),
        ('Olivia', 'Wilson', 4),
        ('James', 'Anderson', 5),
        ('Mia', 'Martinez', 6),
        ('Benjamin', 'Taylor', 7),
        ('Charlotte', 'Jones', 7),
        ('Samuel', 'Clark', 8);