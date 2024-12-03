import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userManagementRoutes from './Service/Routes/UserManagementRoutes.js';
import UserManagement from './Service/userManagementCRUD.js';
import TaskManager from './Service/taskManager.js';
import TaskRoutes from './Service/Routes/TaskManagementRoutes.js';
import db from './db.js';
//setting up express
const app = express();
const PORT = 3010
//Middleware 

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

  
app.use(cors())

// UserManagement endpoints
let userManagement = UserManagement(db)
let userRoutes = userManagementRoutes(userManagement)

userRoutes = new userManagementRoutes()

app.post('/register', userRoutes.registerUser);
app.post('/login', userRoutes.loginUser);
app.get('/tasks/user', userRoutes.viewTasksByUser)

// Tasks endpoints

let taskManager = TaskManager(db)
let taskRoutes = TaskRoutes(taskManager)

app.post('/tasks/create',taskRoutes.createTask);
app.post('/tasks/delete', taskRoutes.deleteTask);
app.post('/tasks/update', taskRoutes.updateTaskStatus)

app.listen(PORT, () =>{
    console.log(`app started on ${PORT}!`)
})