 const express = require('express');
const Users = require('../model/user.model');
const generateToken = require('../middleware/genaratetoken');
 const  router = express.Router()
 require('dotenv').config()
 const jwt = require('jsonwebtoken');

// register user
  router.post("/register", async(req, res) => {
    try {
         const {email, password, username} = req.body
          const Emailexist = await Users.findOne({email})
          if(Emailexist){
            return res.status(400).send({ message: "Email already exist" })
          }
          if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
          }
         const user = new Users({email, password, username})    
        //   console.log(user)
         await user.save()
         res.status(201).send({
            message:"User created successfully",
            user: user
         })
        
    } catch (error) {
        console.error("Error occur", error)
        res.status(500).send({ message: "Error occurred" })
        
    }

 })

 // create login
  router.post("/login", async(req, res) => {
   try {
      // console.log(req.body)
       const {email, password} =  req.body
        const findUser = await Users.findOne({email})

      //   console.log("finduser", findUser)

         if(!findUser){
            return   res.status(401).send({ message: "User not found" })
         }
       const isMatch = await findUser.comparePassword(password)

       if(!isMatch){
         res.status(500).send({message:"InvalidPassword"})
       }


      //  generateToken
      //  console.log("finduser", findUser._id)

       const token =  await generateToken(findUser._id)
      //  console.log(token)
      res.cookie('token', token, { httpOnly: true,
         secure: true, // Ensure this is true for HTTPS
         sameSite: 'None'});

      console.log("token" , token)
      res.status(200).send({message:"login successfull",
         token,
         user:{
            id: findUser._id,
            email: findUser.email,
             username: findUser.username,
             role:findUser.role
         }
      })
      
   } catch (error) {
      console.error("Error")
      res.status(500).send({ message: "Error occurred" })
      
   }

  })

//   create logOut
 router.post("/logOut", async(req, res) => {
   try {
      res.clearCookie("token")
      res.status(200).send({ message: "logout successfull" })
      
   } catch (error) {
      console.error("Error occur", error)
      res.status(500).send({ message: "Error occurred" })
      
   }
 })

//  get all user
 router.get("/get_user", async(req, res) => {
    try {
       const user =  await Users.find({}, `email id role`)
       res.status(200).send({
          message:"total user", user
       })
         
      
    } catch (error) {
      console.error("Error", error)
      res.status(500).json({ error: "An error occurred" })
      
    }
 })

//  delect user
 router.delete("/delete/:id", async(req, res) => {
    try {
       const delectUer = req.params.id
       const user =  await Users.findByIdAndDelete(delectUer)
       if(!user){
         return res.status(500).send({message:"user not found"})
       }
         res.status(200).send({ message: "User deleted successfully" })
      
    } catch (error) {
       console.error("Error", error)
       res.status(500).json({ message: "An error occurred" })
      
    }
 })

//  update user role
router.put("/update/:id", async(req, res) => {
    try {
        const {id} = req.params;
         const {role} = req.body;
         const user = await Users.findByIdAndUpdate(id, {role}, {new:true})
         if(!user){
            return res.status(404).send({messag:"user not found"})
         }
          res.status(200).send({ message: "User updated successfully", user })
      
    } catch (error) {
       console.error("Error", Error)
       res.status(500).json({ message: "An error occurred" })
      
    }
})


  module.exports = router