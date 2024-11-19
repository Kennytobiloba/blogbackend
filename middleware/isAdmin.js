 const  isAdmin = (req, res, next) => {
     if(req.role !== "admin"){
         return res.status(403).json({ message: "Unauthorized access. Only admin can access this route." })
     }
     next()
 }
 module.exports = isAdmin