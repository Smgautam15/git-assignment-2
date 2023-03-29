const mongoose=require('mongoose')

const post=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    userref: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const postModel=mongoose.model('Posts',post)

module.exports=postModel