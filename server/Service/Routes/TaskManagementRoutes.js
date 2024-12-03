import TaskManager from '../taskManager.js';
import db from '../../db.js';

const taskManager = TaskManager(db)

export default function TaskRoutes(taskManager) {
    
        // JWT middleware to authenticat token 
        const authenticateToken = async function  (req, res, next){
            const authHeader = req.headers.authorization; 
            const token = authHeader && authHeader.split(' ')[1]; 
            
            if(!token){
                res.status(401).json({message: `Tokem not authorised`});
            }
            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.user = decoded; 
                next(); 
            } catch (err) {
                console.error('Token verification failed:', err);
                return res.status(403).json({ message: 'Token not valid' });
            }
            }
        
    // Route function for creating a task
    async function createTask(req, res, next) {
        try {
            const { title, description, due_date, status } = req.body;
            const user_id = req.user.id;
            // Validate inputs
            if (!user_id || !title || !description || !due_date || status === undefined) {
                res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await taskManager.createTask(user_id, title, description, new Date(due_date), status);
            res.status(201).json({ message: result });
        } catch (error) {
            console.error('Error creating task:', error);
            next(error);
        }
    }

    // Route function for updating task status
    async  function updateTaskStatus(req, res, next){
        try {
            let title= req.body;

            const result = await taskManager.updateTask(title)
            res.status(200).json({ message: result });
        } catch (error) {
            console.error('Error updating task:', error);
            next(error);
        }
    }

    // Route function for deleting a task
    async function deleteTask(req, res, next){
        try {
            let id = req.body;
            const result = await taskManager.deleteTask(id);
            res.status(200).json({ message: result });
        } catch (error) {
            console.error('Error deleting task:', error);
            next(error);
        }
    }

    return{
        createTask, 
        updateTaskStatus, 
        deleteTask
    }
   
    }