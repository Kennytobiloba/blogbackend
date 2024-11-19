const jwt = require("jsonwebtoken")
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET_KEY
const verifytoken = (req, res, next) => {
    try {
        //  const token = req.headers.authorization?.split(' ')[1] 
        const token = req.cookies.token
          
        // console.log("VERIFYtwo",tokentwo)
        //  console.log("VERIFY",token)
        if(!token){
            return res.status(401).json({ message: "Token is required" })
        }
         const decoded = jwt.verify(token, JWT_SECRET)
         if(!decoded.userId){
             return res.status(403).json({ message: "Token is invalid" })
         }
        req.userId = decoded.userId
        req.role = decoded.role
        next()
        
    } catch (error) {
        console.error("Token verification error", error)
        return res.status(401).json({ message: "Unauthorized" })
        
    }

}
module.exports = verifytoken