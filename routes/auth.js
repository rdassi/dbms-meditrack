const express = require("express");
const bcrypt = require("bcryptjs");

// const {mysql} = require("../../db/mysql");
const auth = require("/middleware/auth");
const generateAuthToken = require("/token/generateAuthToken");

// const ForgotPassword = require("../../models/ForgotPassword");
// const mailer = require("../../mailer/mailer");

const router = express.Router();

router.get("/",auth,async (req,res)=>{
    try {
        const[results,fields] =  await mysql.query("SELECT * FROM users WHERE email = ?",[req.user.email]);
            const userString = JSON.stringify(results[0]);
            const user = JSON.parse(userString);
            delete user.passwd;
            res.json(user);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

router.post("/login",async (req,res)=>{
    try {
        const [results,fields] =  await mysql.query("SELECT id,email,passwd,isUpdater FROM users WHERE email = ?",[req.body.email]);
        if(results.length==0){
            return res.status(400).json({msg:"Authentication Error!"});
        }
        const userString = JSON.stringify(results[0]);
        const user_data = JSON.parse(userString);
        const user = {id:user_data.id,email:user_data.email,isUpdater:user_data.isUpdater}
        const isMatch = await bcrypt.compare(req.body.password,user_data.passwd);
        if(isMatch){
            generateAuthToken(user,(token)=>{
                res.json({token});
            });   
        }
        else{
            res.status(400).json({msg:"Authentication Error!"});
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});



// router.post("/resetpassword",async (req,res)=>{
//     try{
//         const email = req.body.email;
//         const otp = req.body.otp;
//         let newPassword = req.body.newPassword;
//         const forgotPasswordrequest = await ForgotPassword.findOne({email,otp})
//         if(!forgotPasswordrequest){
//             return res.json({"code":"0","msg":"invalid otp!"});
//         }
//         if(otp==forgotPasswordrequest.otp){
//             const salt = await bcrypt.genSalt(10);
//             newPassword = await bcrypt.hash(newPassword,salt);
//             const[updatedResults] = await mysql.query("UPDATE users SET passwd = ? WHERE email = ?",[newPassword,email]);
//             const JSONstring = JSON.stringify(updatedResults);
//             const result = JSON.parse(JSONstring);
//         if(result.changedRows==1){
//             await ForgotPassword.deleteMany({email});
//             return res.json({code:"1","msg":"Password Changed Successfully!"});
//         }
//         }else{
//             return res.json({"code":"0","msg":"invalid otp!"});
//         }
        
//     } catch (error) {
//         res.status(500).send("Server Error!");
//         console.log(error);
//     }
// });


module.exports = router;