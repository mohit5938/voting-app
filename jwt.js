const jwt = require('jsonwebtoken');

const jwtAutMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error:'token not found'});
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
        return res.status(401).json({error:'unauthrized'});  
    }
    try {
        // verify the jwt token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
// in this decode , it contain info of user like id , username etc
        req.user = decoded
        next();
    } catch (error) {
        console.error(error);
        req.status(401).json({error:'Invalid token'});
        
    }
}

const generateToken = (userData) =>{
    return jwt.sign(userData,process.env.JWT_SECRET);

}
module.exports={jwtAutMiddleware,generateToken};