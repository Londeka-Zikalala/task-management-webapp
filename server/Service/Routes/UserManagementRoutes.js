import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import UserManagement from "../userManagementCRUD.js";
import db from '../../db.js';

let userManagement = UserManagement(db)

export default function userManagementRoutes (){
       
// register the user 
        async function registerUser(req,res,next){
           
           try{

            let username = req.body.username;
            let password = req.body.password; 

            console.log(password,username)
            //  Check if the input fields are not empty 
            if(!username || !password){
                res.status(400).json({message:`Username and Password are required`})
            }

            // Check if username already exists in the dta base 

            let existingUser = await userManagement.userLogin(username)

            if(existingUser){
                res.status(400).json({message: `Username already registered, go to login`})
            }

            const hashPassword = await bcrypt.hash(password, 10)
            let user = await userManagement.userRegistration(username, hashPassword)
            res.status(201).json({message: `Registration successful!`, user})

           } 
           catch(error){
                console.error(`Error registering user`, error)
                next(error)
           }
        }

        // Route logic for the login endpoint 

        async function loginUser(req, res, next){
            
           try{
            let username = req.body.username;
            let password = req.body.password; 
            // login the user 

            let existingUser = await userManagement.userLogin(username)

            if(!existingUser){
                res.status(400).json({message: `Username not found, go to register`});
            } else{
                //Check if password matches the users's password
                let validatePassword = await bcrypt.compare(password, existingUser.password)

                if(!validatePassword){
                    res.status(400).json({message: `Password incorrect`})
                }

                // get a token for the user 
                let token = jwt.sign({id: existingUser.id, username: existingUser.username, password: existingUser.password}, process.env.SECRET_KEY, {expiresIn:'1h'})

                res.status(201).json({message: `Login successful!`, token})
            }
           } catch(error){
            console.error(`Login failed`, error)
            next(error)
           }
           }
    

        // JWT middleware to authenticat token 
        const authenticateToken = async function  (req, res, next){
            let token = req.headers.authorization?.split(' ')[1];
            if(!token){
                res.status(401).json({message: `Tokem not authorised`});
            }
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
                    if(err){
                        res.status(401).json({message: `Token not found`})
                    }
                  return req.user = decoded 
            })
        }

        //  View the tasls by the logged in user

            async function viewTasksByUser(req, res, next) {
                try{
                    
                    let userId = req.user.id

                    //get the tasks by user 
    
                       let tasks = await this.userManagement.viewUserTasks(userId)
    
                       if(tasks.length <= 0 ){
    
                         res.status(401).json({message:`No tasks found`})
    
                       }else{
                         res.status(201).json({message:`Taks found`, tasks})
                       }
                }catch(error){
                    console.error(`Error fetching tasks`, error)
                }
            }

return{
    registerUser, 
    loginUser, 
    viewTasksByUser,
    authenticateToken
}
}