const jwt = require('jsonwebtoken');


exports.Authorized = (req,res,next) => {
    const token = req.headers.authorization;

    jwt.verify(token,'secretkey',(err,encrypt) => {
        if(err){
            res.status(500).json({success:false});
        }
        req.id = encrypt;
        
   
        next();
    })
}

