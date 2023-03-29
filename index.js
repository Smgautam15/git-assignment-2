const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Users = require('./models/schema')
const middileware = require('./middleware')
const Posts = require('./models/postSchema')
const middleware = require('./middleware')
const PORT = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const url = "mongodb://localhost/assignment"
mongoose.connect(url, { useNewUrlParser: true }).then(() => {
  console.log("mongodb database is connected...")
}).catch((e) => {
  console.log(e.message);
})

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await Users.findOne({ email: email })
    if (exists) {
      console.log("User is already existed")
      return res.send("User is already existed")
    }
    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = await Users.create({ name: name, email: email, password: hashedPassword })
    res.json({
      status: "Success",
      user
      // hash
    })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
})



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const exists = await Users.findOne({ email: email })
    // console.log(exists.password)
    if (!exists) {  //if user is not there in database collection user is not existed then 
      console.log("User is not existed")
      return res.send("User is not existed")
    }
    const passwordValidation = await bcrypt.compare(password, exists.password);  //we are comparing the req.password is equals to existed database password
    // console.log(passwordValidation) 
    if (!passwordValidation) {
      return res.send("Password is incorrect")
    }
    const payload = {
      user: {
        id: exists._id
      }

    }
    const privateKey = "satendra"
    const token = jwt.sign(payload, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60
    })//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    //eyJpZCI6IjYzZmIwOGQxMDRiNDIwNzk4NzgwMGUyOCIsImlhdCI6MTY3NzQwMTU0NSwiZXhwIjoxNjc3NDA1MTQ1fQ.
    //f7As2s7AgIwdoso1lX33A5oJgjJ7hksSfB7JYem9L0g"
    res.status(200).json({
      status: "Success",
      token
    })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/posts', middileware, async (req, res) => {
  try {
    // console.log(req.id)    ---->it is from after decoding the user details from middleware function (req.id=decoded.id) 
    const { title, body, image } = req.body
    const userId = req.user.id
    const newPost = await Posts.create({
      title: title,
      body: body,
      image: image,
      userref: req.user.id
    })
    res.status(200).json({
      status: "post created",
      newPost
    })
  }
  catch (err) {
    res.status(400).json({
      message: err.meaasage
    })
  }
})

app.get('/posts', middleware,async (req,res)=>{
  try{
    const userref=req.user.id
    const allPosts=await Posts.find({userref})
    res.status(200).json({
      status:"Success",
      allPosts
    })
  }
  catch(err){
    res.status(200).json({message:err.message})
  }
})

app.put('/posts/:postId',middleware,async (req,res)=>{
  try{
    // console.log(req.params)
    const id=req.params.postId
    const post=await Posts.findById(id)
    res.status(200).json({
      status:"Success"
    })
  }
  catch(err){
    res.status(400).json({message:err.message})
  }
})

app.delete('/posts/:postId',middleware,async (req,res)=>{
  try{
    const id=req.params.postId
    const deletedPost=await Posts.findByIdAndDelete(id)
    res.status(200).json({
      status:"Successfully deleted"
    })
  }
  catch(err){
    res.status(400).json({
      message:err.message
    })
  }
})
app.listen(PORT, () => {
  console.log("server is running")
})