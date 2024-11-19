 const jwt = require('jsonwebtoken');
const Users = require('../model/user.model');

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET_KEY
// console.log(JWT_SECRET)

 
 const generateToken = async(userId) => {
    try {
         const user = await Users.findById(userId)  
          console.log("user found", user)

         if(!user){
            throw new Error("user not found")
         }  
         const token = jwt.sign({ userId: user._id, role: user.role  }, JWT_SECRET, { expiresIn: '1h' });
          return token  
          console.log("user token", token)
    } catch (error) {
        console.error("Error generating token", error)
        return null
        
    }

 }
 module.exports = generateToken