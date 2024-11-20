const express = require("express")
const cors =  require("cors")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const blogrouter =  require("./routes/blog.route")
const CommentRouter = require("./routes/comments.route")
const Userrouter = require("./routes/user.route")

require('dotenv').config()

app.use(cors({
  origin:"https://blogfrontend-p2br.onrender.com",
  credentials: true,
  
}))
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//  console.log(process.env.JWT_SECRET_KEY)


 app.use("/api/blogs", blogrouter)
 app.use("/api/comments", CommentRouter)
 app.use("/api/auth", Userrouter)


 app.get("/", (req, res) => {
    res.send("Hello from node ");
  });
  
   port = process.env.PORT
  mongoose
    .connect(
     process.env.mongodb
    )
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(port, () => {
        console.log("Server running on port 3000");
      });
    })
    .catch((err) => console.log("connection failed"));
  