# TASK MANAGEMENT APP 
---
## Table Of Contents 

1. [Introduction](#Introduction)
2. [Setup Instructions](#Setup)
3. [Installation](#Installation)
4. [Usage Example](#Usage)
5. [File Structure](#Files)
6. [Assumptions and improvements needed](#Considerations)

--- 
## Introduction 
This Task Management app was built using Node.js JavaScript,and React. It allows users to create, update, and delete tasks in their respective accounts.

---
## Prerequisites 

### Before starting, ensure you have the following installed:

1. Node.js 
2. npm
3. PostgreSQL (for database)
--- 
## Setup 

### 1. git clone https://github.com/Londeka-Zikalala/task-management-app.git

bash
```
 cd task-management-app
 ```

### 2. Database setup and migration

   *Create the database:*

1. First, create a database in PostgreSQL. You can do this by running the following command in the PostgreSQL shell:

bash

```CREATE DATABASE task_management_db;```

2. Run the SQL migration:
   - Inside the server folder, you will find the SQL migration script located at /sql/Tables.sql.

    bash
   
   ```psql -U your_database_user -d task_management_db -f sql/Tables.sql```
   
 ### 3. Environment Variables 
 
 1. Add your PostgreSQL connection string to the `.env` file.
 2. Generate a jwt secret key and add it to the `env` file.
    
    bash
    
      ``` openssl rand -base64 32 ```

--- 
## Installation 


   1. run npm install in each folder server and client

   2. *From the server* run ``` npm test ``` - if the tests are passing, everything is running smoothly and you're ready to go.

   3. *Start the Server* run: ``` node server/index.js ```

   4. *Start the React app* from the client folder : run ``` npm start ```
--- 
## Usage 

### Task Management Routes

**The app has key routes related to user-task management:**

1. `GET` /tasks/user: Fetches tasks  to a belonging to the logged in user. 
Authentication
2. `POST` /users/register: Registers a new user
3. `POST` /users/login: Logs in an existing user and provides a JWT token for authentication.
4. `POST` /tasks/create: Creates a new task.
5. `POST` /tasks/update: Updates a task's status to "completed". 
6. `POST` /tasks/delete: Deletes a task. 

### Example Usage : 

      JavaScript
        ```
        import axios from 'axios';
        
        const createTask = async () => {
          try {
            const response = await axios.post('http://localhost:3010/tasks/create', {
              user_id: 1,
              title: 'Finish Task Manager App',
              description: 'Complete the task manager app implementation.',
              due_date: '2024-12-31',
              status: false
            });
            console.log(response.data);
          } catch (error) {
            console.error('Error creating task:', error);
          }
        };
        
        createTask();
        
        ```

  --- 
  
  ## File Structure 
  
bash 
```
task-management-app/

│

├── client/

│   ├── public/

│   │   ├── index.html

│   ├── src/

│   │   ├── App.jsx

│   │   ├── index.jsx

│   │   ├── LoginForm.jsx

|   |   |── tasks.css              # styling for tasks table

│   │   ├── Taskscreen.jsx

│   ├── package.json                # Dependencies and scripts

│

├── server/

│   ├── db.ts                       # Database connection setup

│   ├── service/                    # Business logic for tasks and user management

│   │   ├── TaskManager.js          # Task management logic (CRUD operations)

│   │   ├── UserManagement.js       # User management logic

│   ├── routes/                     # Express routes

│   │   ├── TaskManagementRoutes.js # Routes for task management

│   │   ├── UserManagementRoutes.js # Routes for user management

│   ├── index.js                    # Express server initialization

│   ├── .env                         # Environment variables

|   ├── package.json             # Dependencies and scripts

└── README.md                       # Project documentation
```
----
## Assumptions and Improvements 

### Assumptions 

**1. Users are not assigned any tasks**
**2. Small production / personal use**
**3. App must be built to run locally, no need for CLI**

### Improvements Needed

**1. Task duplication fixed**
**2. Validations for registering and login**
**3. Routing errors, losing the frontend connection often**
**4. Capturing the username for the Taskscreen h1.**





