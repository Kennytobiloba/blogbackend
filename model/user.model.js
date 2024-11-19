 const mongosse = require("mongoose")
 const bcrypt =  require("bcrypt")
   const UserSchema = new mongosse.Schema({
    username: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },

   })
    // const  hashPasword = await bcrypt.hash()
    UserSchema.pre("save", async function (next){
       const user = this;
       if(!user.isModified("password")) return next()
         const hashPssword =  await bcrypt.hash(user.password, 10)
       user.password = hashPssword;
       next();
    })
    

     // const  compare = await bcrypt.hash()
      UserSchema.methods.comparePassword = function(givenPassword){
          return bcrypt.compare(givenPassword, this.password)

      }
    const Users = mongosse.model("user", UserSchema)
    module.exports = Users;

   