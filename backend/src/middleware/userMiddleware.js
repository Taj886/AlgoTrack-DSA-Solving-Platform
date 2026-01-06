const jwt = require("jsonwebtoken");
const User = require('../models/user');
const redisClient =  require("../config/redis")


const userMiddleware = async (req,res,next)=> {
    try{

        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not present");
        
        const payload = jwt.verify(token,process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("id is missing");
        }

          const result = await User.findById(_id);


        if(!result){
            throw new Error("user doesn't exist");
        }

    // Note: key format should match how tokens are stored (no space after colon)
    const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked) {
            throw new Error("invalid token");
        }

        req.result = result;

        next();

     }
     catch(err){
        res.status(401).send("Error:"+ err.message)
     }
}

module.exports = userMiddleware;