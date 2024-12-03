//CRUD for user related queries 
import db from "../db.js";

export default function UserManagement(){
   
    // function to register a user by ensuringg that the username and password are unuque
    async function userRegistration(username, password){
        // Insert the username and password into the users table, only when they are unique
        try{
            await db.none(`INSERT INTO users (username, password) VALUES ($1,$2) ON CONFLICT (username) DO NOTHING`, [username,password])
            return 'user registered'
        }catch(error){
            console.error(`Error registering user`, error)
            return 'error registering user'
        }
    } 

    //Function to login a user using the password and username 
    async  function userLogin(username){
        try{
             // fetch the user 
             const user = await db.one(`SELECT * FROM users WHERE username = $1`, [username])
             return user

        }catch(error){
            console.error(`Error fetching user information`, error)
            return null
        }  
    }

    // function to view all tasks by a user, it joins the tasks table and the users table 
    async  function viewUserTasks(id){
        //fetch tasks for a user using the useridi
        try{
            const userTasks= await db.manyOrNone(`SELECT tasks.id, tasks.title, tasks.due_date, tasks.status FROM tasks JOIN  user_tasks ON tasks.id = user_tasks.task_id WHERE user_tasks.user_id = $1 ORDER BY tasks.due_date ASC`,[id]);
            // iterating and filtering throught the Task array for the user's task by due date
            const tasks = [];
            for (const task of userTasks){
                tasks.push({... task, due_date: new Date(task.due_date)})
            }
            return tasks
            
        } catch(error){
            console.error(`Error fetching user tasks`, error)
        }
    }
    return {
            userRegistration, 
            userLogin, 
            viewUserTasks
    }
}



