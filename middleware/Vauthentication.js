const jwt = require("jsonwebtoken")


function TokenAuthentication (req,res,next){
const token = req.headers['vtoken']
if(!token){
    return  res.status(401).send('You are not Authorised')
}else{
    jwt.verify(token,process.env.VENDOR_SECRETE,(err,decode)=>{
        if(err){
          return  res.status(400).send('Invalid Token Provided Please Login Again')
        }else{
            req.vid = decode.vid;
            next()
        }

    })
}
}

module.exports = TokenAuthentication