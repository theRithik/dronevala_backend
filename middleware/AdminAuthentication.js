const jwt = require("jsonwebtoken")


function SuperAdminAuthentication (req,res,next){
const token = req.headers['admintoken']
if(token){
    jwt.verify(token,process.env.ADMIN_SECRETE,(err,decode)=>{
        if(err){
            return  res.status(400).send('Invalid Token Provided Please Login Again')
        }else{
            req.id = decode.id;
            next()
        }
    })
}else{
    return  res.status(401).send('You are not Authorised')
}
}

module.exports = SuperAdminAuthentication