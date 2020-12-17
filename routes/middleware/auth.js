const jwt = require("jsonwebtoken");

//role ()=> function returns the async function; something like a higher order function (f returns f)
//calling auth(doc)-> prefills role doctor at line "if(req.role!=role)" as if authenticating doc; similarly for patient also
//(explore other options when you have the braincells to)
const auth = (role)=> async (req,res,next)=>{
    try {
        const token = req.header("x-auth-token");
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,decoded)=>{
            if(error) throw error;
            req.email=decoded.email;
            req.role=decoded.role;
            if(req.role!=role){
                throw new Error("Wrong Role!")
            }
            req.token=token;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({error:"Invalid Token!"});
    }
};

module.exports = auth;
// DONT TOUCH THIS SHIT AT ALL FOR YOUR OWN SAFETY