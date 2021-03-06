const jwt = require("jsonwebtoken");

// const generateAuthToken = (email,role,cb)=>{
//     jwt.sign({email: email},process.env.JWT_SECRET,{expiresIn:"1d"},(error,token)=>{
//         if(error) throw error;
//         cb(token);
//     });
// }
/**
 * returning auth tokens to be used for frontend
 * @param {number} id 
 * @param {string} role 
 */

async function GenerateJWToken(id,role) {
    
    return jwt.sign({id,role}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3d',
    });
}
module.exports = GenerateJWToken;