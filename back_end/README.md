# 💉 E-Vaccine Reminder System

A full-stack web application for managing children's vaccination records and vaccine reminders.

The system allows parents/users to register, manage their children's vaccination information, view available vaccines, create vaccination reminders, and mark reminders as completed.

An administrator can manage the vaccine database by adding, updating, and deleting vaccines.

---

## 📌 Project Overview

The **E-Vaccine Reminder System** is designed to help parents keep track of their children's vaccination schedules.

The application provides two main roles:

### 👤 User

Users can:

- Register an account
- Login securely
- Add children
- View their children
- View available vaccines
- Add vaccine reminders
- View their own reminders
- Mark reminders as completed

### 👨‍💼 Admin

Administrators can:

- Login as admin
- View vaccines
- Add new vaccines
- Update vaccine information
- Delete vaccines

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Live Server

## Backend

- Node.js
- Express.js
- JavaScript

## Database

- MongoDB
- Mongoose

## Authentication & Security

- JWT (JSON Web Token)
- bcrypt
- CORS
- dotenv

## Development Tools

- Visual Studio Code
- MongoDB Compass
- Postman
- Git
- GitHub

---

# 📁 Project Structure

```text
e_vaccine_remainder
│
├── back_end
│   │
│   ├── models
│   │   ├── user.js
│   │   ├── Child.js
│   │   ├── Vaccine.js
│   │   └── Reminder.js
│   │
│   ├── routes
│   │   ├── userRoutes.js
│   │   ├── childRoutes.js
│   │   ├── vaccineRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── .env
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── front_end
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── style.css
│   └── script.js
│
└── .gitignore
🗄️ Database Structure

The project uses MongoDB database:

e_vaccine_reminder

The main collections are:

1. Users

Stores user and administrator accounts.

Fields:

_id
name
email
password
role

Possible roles:

user
admin
2. Children

Stores information about children.

Fields:

_id
name
dateOfBirth
gender
parentId

parentId connects a child to the user who added the child.

3. Vaccines

Stores available vaccine information.

Fields:

_id
vaccineName
description
recommendedAge
doseNumber
4. Reminders

Stores vaccination reminders.

Fields:

_id
childId
vaccineId
dueDate
status

Possible reminder statuses:

Pending
Completed
🔗 Database Relationships

The main relationships are:

USER
  |
  | 1 : N
  |
CHILD
  |
  | 1 : N
  |
REMINDER
  |
  | N : 1
  |
VACCINE
Relationship Details
User 1 ─────── N Child

Child 1 ─────── N Reminder

Vaccine 1 ─────── N Reminder

A user can have multiple children.

A child can have multiple vaccination reminders.

A vaccine can be associated with multiple reminders.

🔐 Authentication

The application uses JWT authentication.

When a user successfully logs in:

The server verifies the email and password.
The password is checked using bcrypt.
A JWT token is generated.
The frontend stores the token.
The token is sent with protected API requests.

Example:

Authorization: Bearer <token>

The backend verifies the token using the authentication middleware.

🔒 Password Security

Passwords are never stored as plain text.

The application uses:

bcrypt

to hash passwords before storing them in MongoDB.

👤 User API Routes
Register
POST /api/users/register

Creates a new normal user account.

Example request:

{
    "name": "John",
    "email": "john@gmail.com",
    "password": "123456"
}

New registrations are automatically assigned:

role: user
Login
POST /api/users/login

Example request:

{
    "email": "john@gmail.com",
    "password": "123456"
}

Returns a JWT token after successful authentication.

👶 Child API Routes
Add Child
POST /api/children/add

Authentication required.

The parent/user ID is taken from the authenticated JWT rather than trusting a parent ID supplied by the frontend.

Example request:

{
    "name": "Anu",
    "dateOfBirth": "2024-01-10",
    "gender": "Female"
}
View My Children
GET /api/children/view

Authentication required.

Returns only the children belonging to the currently logged-in user.

💉 Vaccine API Routes
Add Vaccine
POST /api/vaccines/add

Authentication required.

Admin only.

Example:

{
    "vaccineName": "BCG",
    "description": "Protects against tuberculosis",
    "recommendedAge": "At birth",
    "doseNumber": 1
}
View Vaccines
GET /api/vaccines/view

Authentication required.

Returns available vaccines.

👨‍💼 Admin API Routes
Update Vaccine
PUT /api/admin/vaccine/update/:id

Authentication required.

Admin only.

Example:

{
    "vaccineName": "BCG",
    "description": "Protects against tuberculosis",
    "recommendedAge": "At birth",
    "doseNumber": 1
}
Delete Vaccine
DELETE /api/admin/vaccine/delete/:id

Authentication required.

Admin only.

Deletes a vaccine using its MongoDB ID.

🔔 Reminder API Routes
Add Reminder
POST /api/reminders/add

Authentication required.

The system checks that the selected child belongs to the logged-in user.

Example:

{
    "childId": "CHILD_ID",
    "vaccineId": "VACCINE_ID",
    "dueDate": "2026-10-10"
}
View My Reminders
GET /api/reminders/view

Authentication required.

Returns reminders belonging only to the logged-in user's children.

Complete Reminder
PUT /api/reminders/complete/:id

Authentication required.

Marks a reminder as:

Completed
🌐 Frontend Pages
Home Page
index.html

Provides:

Project introduction
Login button
Registration button
Feature overview
Registration Page
register.html

Allows new users to create accounts.

Login Page
login.html

Allows users and administrators to login.

Users are automatically redirected based on their role.

User  → dashboard.html

Admin → admin.html
User Dashboard
dashboard.html

Users can:

Add children
View children
View available vaccines
Add reminders
View reminders
Complete reminders
Logout
Admin Dashboard
admin.html

Administrators can:

Add vaccines
View vaccines
Edit vaccines
Delete vaccines
Logout
🚀 How to Run the Project
Step 1 — Clone the Repository
git clone https://github.com/revathiaddanki19/e_vaccine_remainder.git

Move into the project:

cd e_vaccine_remainder
⚙️ Backend Setup

Move into the backend folder:

cd back_end

Install dependencies:

npm install
🔑 Environment Variables

Create a file named:

.env

inside the back_end folder.

Add:

JWT_SECRET=e_vaccine_secret_key

Do not upload .env to GitHub.

🗄️ MongoDB Setup

Make sure MongoDB is running locally.

The application uses:

mongodb://127.0.0.1:27017/e_vaccine_reminder

The database name is:

e_vaccine_reminder

MongoDB Compass can be used to view the database and collections.

▶️ Start the Backend

Inside the back_end folder run:

node server.js

Expected output:

MongoDB connected successfully
Server running on http://localhost:5000
🌐 Start the Frontend

Open the:

front_end

folder in Visual Studio Code.

Install the Live Server extension if it is not already installed.

Right-click:

index.html

and select:

Open with Live Server

The frontend will open in the browser.

🧪 Testing

The application was tested using:

Browser
MongoDB Compass
Postman

Tested user functionality includes:

User Registration
User Login
Add Child
View Children
View Vaccines
Add Reminder
View Reminders
Complete Reminder
Logout

Tested administrator functionality includes:

Admin Login
View Vaccines
Add Vaccine
Update Vaccine
Delete Vaccine
Logout
🔐 Access Control

The application provides role-based access.

Normal User

Can access:

Children
Vaccines
Reminders

A normal user cannot perform administrator vaccine management operations.

Administrator

Can access:

Add Vaccine
Update Vaccine
Delete Vaccine
View Vaccines

Administrator operations require a valid JWT token and an admin role.

📌 Example Application Flow
              E-Vaccine Reminder
                       |
              -------------------
              |                 |
            User              Admin
              |                 |
           Login              Login
              |                 |
         Dashboard       Admin Dashboard
              |                 |
       --------------      --------------
       |      |     |      |     |      |
     Child  Vaccine Reminder Add   Edit  Delete
       |
    Reminder
       |
    Complete
🎯 Project Objectives

The main objectives of this project are:

To provide a digital vaccination management system.
To help parents maintain children's vaccination records.
To provide vaccination reminders.
To reduce the possibility of missing vaccination dates.
To provide secure user authentication.
To provide role-based administrator access.
To maintain vaccine information in a centralized database.
🔮 Future Enhancements

Possible future improvements include:

Email vaccination reminders
SMS notifications
Push notifications
Automatic vaccination schedule generation
Multiple children management improvements
Vaccine history reports
PDF vaccination reports
Calendar integration
Mobile application
Improved admin analytics
Dashboard statistics
Automatic reminder notifications
👩‍💻 Developer

Revathi Addanki

B.Tech – Computer Science and Engineering