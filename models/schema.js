const mongoose=require('mongoose')
// console.log(mongoose.Schema)
const user =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
const Users=mongoose.model('Users',user)

module.exports=Users