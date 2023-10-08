-- Department table --
INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Human Resources'),
       ('Legal'),
       ('Sales');

-- Role table --
INSERT INTO role (title, salary, department_id)
VALUES ('Director of Engineer', 115000, 1),
       ('Lead Engineer', 85000, 1),
       ('Accountant', 95000, 2),
       ('Finance Staff', 80000, 2),
       ('Human Resources Staff', 93000, 3),
       ('Corporate Lawyer', 155000, 4),
       ('Lead Legal Team', 90000, 4),
       ('Customer Service', 75000, 5);

-- Employee Table --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Emily', 'Johnson', 2, NULL),
  ('Daniel', 'Smith', 1, 1), -- Daniel's supervisor is Emily
  ('Sophia', 'Brown', 3, NULL),
  ('William', 'Davis', 4, 3), -- William's supervisor is Sophia
  ('Olivia', 'Wilson', 5, NULL),
  ('James', 'Anderson', 5, NULL),
  ('Mia', 'Martinez', 6, NULL),
  ('Benjamin', 'Taylor', 7, 6), -- Benjamin's supervisor is Mia
  ('Charlotte', 'Jones', 7, 6),  -- Charlotte's supervisor is Mia
  ('Samuel', 'Clark', 8, NULL);