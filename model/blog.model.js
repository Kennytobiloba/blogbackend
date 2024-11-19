 const mongoose = require("mongoose")
 const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    content:{type:Object , required:true},
    coverImg: String,
    category: String, 
    author: { type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    rating: Number,
    createdAt: { type: Date, default: Date.now },
});
 const Blogs = mongoose.model("blog", BlogSchema)
  module.exports = Blogs;