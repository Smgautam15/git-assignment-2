const jwt=require('jsonwebtoken')
const secret = "satendra"
module.exports=function (req,res,next){
    try{
        let token=req.header('token')
        // console.log(token)
        if(!token){
            console.log("no token")
            return res.status(400).send('token not found')
        }
        let decoded=jwt.verify(token,secret)//we get payload as user object inside our id
        req.user=decoded.user
        // console.log(req.id)
        // console.log("decoded.user",decoded.id)
       next()
       
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
}