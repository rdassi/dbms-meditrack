const express = require("express");
const bcrypt = require("bcryptjs");
const assert = require("assert");
//const auth = require("/middleware/auth");
const generateAuthToken = require("./token/generateAuthToken");
const { db } = require('../db');


const router = express.Router();
router.post('/register/doctor', async (req, res, next) => {
    //input {..data..}
    //output {ok:true}
    // TODO REGISTER
try{
    
    //temp password added here
    // req.body.pwd = "passowrd";
    const pwd = req.body.pwd;
    
    const salt = await bcrypt.genSalt(10);
    
    const hashedpwd = await bcrypt.hash(pwd, salt);
    console.log(pwd,hashedpwd);
    const [rows] = await db.query('insert into doctor (email, name, ph_no, dob, sex, qualification, specialization, pwd) values(?)', [[req.body.email, req.body.name, req.body.ph_no, req.body.dob, req.body.sex, req.body.qualification, req.body.specialization, hashedpwd]]);
    //assert(rows.length === 1, 'incorrect values');
    res.json({ "ok": "true" });

}
    catch (e) {
        console.log(e);
    res.status(403).json({ ok: false, status: 'no auth' });
}
})

router.post('/register/patient', async (req, res, next) => {
    //input {..data..}
    //output {ok:true}
  
    try {
        // req.body.pwd = "passowrd";
        const pwd = req.body.pwd;
        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(pwd, salt);
        console.log(pwd,hashedpwd);
        const [rows] = await db.query('insert into patient (email, name, ph_no, dob, address, sex, age,height, weight, pwd) values(?)', [[req.body.email, req.body.name, req.body.ph_no, req.body.dob, req.body.address, req.body.sex, req.body.age, req.body.height, req.body.weight, hashedpwd]]);
        //assert(rows.length === 1, 'incorrect values');
        res.json({ "ok": "true" });

    }
    catch (e) {
        console.log(e);
        res.status(403).json({ ok: false, status: 'no auth' });
    }
})


router.post('/login/doctor', async (req, res, next) => {
    //input -> req.body = {email:<>,pwd:<>}
    //output ->{ok:true, atoken:<>}

    try {
        const [rows] = await db.query('select email,pwd from doctor where email=?', [req.body.email]);
        // if(rows.length===0){throw new Error();}
        assert(rows.length === 1, 'no users');
        const sentPwd = req.body.pwd;
        const expectedPwd = rows[0].pwd;
        const result = await bcrypt.compare(sentPwd, expectedPwd);

        if (result) {
            let docToken= await generateAuthToken(req.body.email,"doctor");
            res.json({ ok: true, atoken: docToken });
        } else {
            throw new Error();
        }

    } catch (e) {
        console.log(e);
        res.status(403).json({ ok: false, status: 'no auth' });
    }
    
})

router.post('/login/patient', async (req, res, next) => {
    //input -> req.body = {email:<>,pwd:<>}
    //output ->{ok:true, atoken:<>}

    try {
        const [rows] = await db.query('select p_id,pwd from patient where email=?', [req.body.email]);
        // if(rows.length===0){throw new Error();}
        assert(rows.length === 1, 'no users');
        const sentPwd = req.body.pwd;
        
        const expectedPwd = rows[0].pwd;
        console.log(sentPwd,expectedPwd);
        const result = await bcrypt.compare(sentPwd, expectedPwd);
        if (result) {
            let patToken= await generateAuthToken(req.body.email,"patient");
            res.json({ ok: true, atoken: patToken });
        } else {
            throw new Error();
        }

    } catch (e) {
        console.log(e);
        res.status(403).json({ ok: false, status: 'no auth' });
    }
})

module.exports = router;