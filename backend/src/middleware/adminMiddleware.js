const jwt = require("jsonwebtoken");
const User = require('../models/user');


const adminMiddleware = async (req,res,next)=> {
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

          if(payload.role!='admin')
            throw new Error("invalid token");


        if(!result){
            throw new Error("user doesn't exist");
        }

        req.result = result;

        next();

     }
     catch(err){
        res.status(401).json({message: "Error:" + err.message})
     }
}

module.exports = adminMiddleware;