 const mongoose = require("mongoose")

  const CommentSchema =  new mongoose.Schema({
    comment: { type: String, required: true },
    user:String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    createdAt: { type: Date, default: Date.now },

  })
   const Comments = mongoose.model("comment", CommentSchema)

   module.exports = Comments;