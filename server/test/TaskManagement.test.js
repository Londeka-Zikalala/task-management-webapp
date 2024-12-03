import UserManagement from "../Service/userManagementCRUD.js";
import TaskManager from "../Service/taskManager.js";
import db from "../db.js";
import assert from "assert";

describe('TaskManager class tests', function(){
    let userManagement = UserManagement(db)
    let taskManager =  TaskManager(db)

    this.beforeAll(async function(){
        await db.none(`TRUNCATE TABLE user_tasks RESTART IDENTITY CASCADE`);
        await db.none(`TRUNCATE TABLE tasks RESTART IDENTITY CASCADE`);

    })

    it(`create a task for a user`, async function(){
        //Create user and get the id 
        let username  = 'Thandeka'
        let password  = 'Password'
        // task details
        let title  = 'recruitment report';
            let description = 'report on iuntern recruitment';
            let due_date = new Date('2024-12-07');
            let status= false;

        await userManagement.userRegistration(username, password)
    
        let user =  await userManagement.userLogin(username, password)
        console.log(user)
        // create task 

         let task = await taskManager.createTask(user.id, title, description, due_date, status); 
                assert.equal(task, 'Task created!');
    })

    it(`should update a task when completed`, async function(){
        //get task title 
        //Create user and get the id 
        let username  = 'Thandeka'
        let password  = 'Password'
        // task details
        let title  = 'recruitment report';
            let description = 'report on iuntern recruitment';
            let due_date = new Date('2024-12-07');
            let status= false;

        await userManagement.userRegistration(username, password)
    
        let user =  userManagement.userLogin(username, password)
        // create task 

        let task = await taskManager.createTask(user.id, title, description, due_date, status); 

        //update task 

        let updatedTask = await taskManager.updateTask(task.title)

        assert.equal(updatedTask, 'Task completed' )

    })

    it(`should delete a task using the title`, async function(){
        //Create user and get the id 
        let username  = 'Thandeka'
        let password  = 'Password'
        // task details
        let title  = 'recruitment report';
            let description = 'report on iuntern recruitment';
            let due_date = new Date('2024-12-07');
            let status= false;

        await userManagement.userRegistration(username, password)
    
        let user =  userManagement.userLogin(username, password)
        // create task 

        let task = await taskManager.createTask(user.id, title, description, due_date, status); 

        // delete task 
      let deleteTask =  await taskManager.deleteTask(task.title);
            assert.equal(deleteTask, 'Task deleted')
        
    })
})