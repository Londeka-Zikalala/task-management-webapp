import db from "../db.js";

export default function TaskManager () {
    
    //Function to create a task 
    async function createTask( user_id, title, description, due_date, status){
       try{

        //Insert task information in the table 
       let task = await db.one(`INSERT INTO tasks (title, description, due_date, status) VALUES ($1, $2, $3, $4) RETURNING id`, [title, description, due_date,status])
            let id = task.id
       // Link the task to a loggned in user 
       await db.none(`INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)`,[user_id, id])
        return 'Task created!'
    } catch(error){
        console.error(`Error setting task `, error)
        return 'Error creating task'
    }
}

// Function tp update the task status to complete

async function updateTask(title){
    try{
        //Set the boolean to true
        await db.none(`UPDATE tasks SET status = true WHERE title = $1`,[title])
        return `Task completed`;
    } catch(error){
        console.error(`Error updating task `,error)
        return `Error updating task`
    }
}
    //function to delete task

    async function deleteTask(title){
        // remove the task based on task title
        try{
            await db.none(`DELETE FROM tasks WHERE title = $1`, [title])
            return `Task deleted!`
        }catch(error){
        console.error(`error deleting task`, error)
        return `Error deleting task`
    }
}
        return{
                createTask,
                updateTask,
                deleteTask
        }
}

