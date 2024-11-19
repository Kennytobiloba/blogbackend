 const express = require('express');
const Blogs = require('../model/blog.model');
const Comments = require('../model/comment.model');
const verifytoken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
  const router = express.Router()

  //  create blog

   router.post("/create_blog",verifytoken,isAdmin, async(req, res) => {
    try {
       const newPost = new Blogs({...req.body, author:req.userId})
      //  author:req.userId
       await newPost.save()
       res.status(201).send({
        message:"Post created successfully",
        post: newPost
       })
      
    } catch (error) {
      console.error("failed feching blogs", error)
      res.status(500).send({ message: "Failed to fetch blogs" })
      
    }

    
     
   })


//  search for blogs and  find all blogs

  router.get("/", async(req,res) => {
       try {
        
         const {search, category, location} = req.query
          console.log(search)
           let query = {}

          if(search){
            query={
              ...query,
              $or:[
                {title:{$regex:search, $options:"i" }},
                { content:{$regex:search, $options:"i" }}
              ]
            }

          }

          if(category){
           query = {
            ...query,
             category
           }

          }
          if(location){
            query = {
             ...query,
              location
            }
 
           }

        const posts = await Blogs.find(query).populate("author","email").sort({createdAt: -1})
         res.status(200).send(posts)
         // message:"Blogs fetched successfully",
          // posts: post
        
       } catch (error) {
        console.error("failed feching blogs", error)
        res.status(500).send({ message: "Failed to fetch blogs" })
        
       }
  })


  //  get Blogs by id

  router.get("/:id",  async(req, res) => {
     try {
      // console.log(req.params.id)
       const postId =  req.params.id
       const findBlog = await  Blogs.findById(postId)
       if(!findBlog){
        return res.status(404).send({ message: "Blog not found" })
       }
      //  after creating the  comment
       const comment = await  Comments.find({postId:postId}).populate("user", "username email")

         //  after creating the  comment


       res.status(200).send({
        post: findBlog,
        comment: comment
       })
      
     } catch (error) {
      console.error("Error occur", error)
      res.status(500).send({ message: "Error occurred" })
      
     }
   })


  //  update a bolg
 router.put("/update_blog/:id",verifytoken, isAdmin, async(req, res) => {
   try {
     const postId = req.params.id
     const update = await Blogs.findByIdAndUpdate(postId,{
      ...req.body,
     }, {new:true})
     if(!update){
      return  res.status(404).send({ message: "Blog not found" })
     }
     res.status(200).send({
      message:"Blog updated successfully",
      post: update
     })
    
   } catch (error) {
     console.error("Error occur", error)
     res.status(500).send({ message: "Error occurred" })
    
   }
 })

//  delected blog
 router.delete("/delete/:id",verifytoken, async(req, res) => {
  try {
    const post =  req.params.id
    const delectPost = await Blogs.findByIdAndDelete(post)
    if(!delectPost){
     return  res.status(404).send({ message: "Blog not found" })
    }
    //   comment
     await  Comments.deleteMany({ postId:post })
    res.status(200).send({
     message:"Blog deleted successfully",
     post: delectPost
    })
    
  } catch (error) {
    console.error("Error occur", error)
    res.status(500).send({ message: "Error occurred" })
    
  }
 
 })

//  related route
  router.get("/related/:id", async(req, res) => {
     try {
      const relatedPost = req.params.id
      if(!relatedPost){
       return res.status(400).send({
          message: "Invalid id"
        })
      }
       const Relatedblog = await Blogs.findById( relatedPost)
       if(!Relatedblog){
         res.status(404).send({ message: "Blog not found" })
       }
      const titleRegex = new RegExp(Relatedblog.title.split(" ").join("|"), "i")
      const relatedQuery = {
        _id:{$ne:relatedPost},
        title:{$regex:titleRegex}
      }

      const RelatedBlogs = await Blogs.find(relatedQuery)
      res.status(200).send(RelatedBlogs)
      
     } catch (error) {
      console.error("Error" , error)
      res.status(500).send({ message: "Error occurred" })
      
     }
  })





  

  


   module.exports = router