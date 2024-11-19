 const express = require("express") 
const Comments = require("../model/comment.model")
const  router =  express.Router()


router.post("/post-comment", async (req, res) => {
     try {
           const comment = new Comments({...req.body})
            await comment.save()
            res.status(201).send({
               message:"commented sucessfully",
                Blogcomment:comment
            })
          
     } catch (error) {
          console.log("Error", error)
          res.status(500).json({ error: "An error occurred" })
          
     }
})


//  get all comment
 router.get("/get_comment", async(req, res) => {
     try {
           const totalComment = await Comments.countDocuments({})
           res.status(200).send({
               message:"total comment", totalComment
           })
          
     } catch (error) {
          console.log("Error", error)
          res.status(500).json({ error: "An error occurred" })
          
     }
 })

 module.exports = router