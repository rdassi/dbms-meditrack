const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');

router.get('/view/doctor', auth('doctor'), async function (req, res, next) {

    //DISABLE- ADDRESS, HEIGHT, WEIGHT
    //ENABLE- SPECIALIZATION, QUALIFICATION
    //GET DOC INFO AND DISPLAY ON PAGE

    const [rows] = await db.query('select d_id,name,dob, sex, email, ph_no, address, specialization, qualification,timing, days from doctor where d_id=?;', [req.id]);
    res.json({ 'result': rows[0] });

});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

    //DISABLE- SPECIALIZATION, QUALIFICATION
    //ENABLE- ADDRESS, HEIGHT, WEIGHT
    //GET PAT INFO AND DISPLAY ON PAGE
    const [rows] = await db.query('select p_id,name,email,ph_no,dob,sex,address,height,weight from patient where p_id=?', [req.id]);
    res.json({ 'result': rows[0] });

});

router.put('/edit/doctor', auth('doctor'), async function (req, res, next) {

    //DISABLE- ADDRESS, HEIGHT, WEIGHT
    //ENABLE- SPECIALIZATION, QUALIFICATION
    //UPDATE DOCTOR INFORMATION
    try {
        console.log("aaaaaaaaa", req.body);
        const [rows] = await db.query('update doctor set email=?, name=?, ph_no=?, dob=?, sex=?, qualification=?, specialization=?, address=?, timing=?, days=? where d_id=?', [req.body.email, req.body.name, req.body.ph_no, req.body.dob, req.body.sex, req.body.qualification, req.body.specialization, req.body.address, req.body.timing, req.body.days, req.id]);
        res.json({ 'result': "ok" });
    }
    catch (e) {
        res.status(500).json({ 'result': "Internal Server Error" });
    }

});


router.put('/edit/patient', auth('patient'), async function (req, res, next) {

    //DISABLE- SPECIALIZATION, QUALIFICATION
    //ENABLE- ADDRESS, HEIGHT, WEIGHT
    //UPDATE PATIENT INFORMATION
    try {
        const [rows] = await db.query('update patient set email=?, name=?, ph_no=?, dob=?, sex=?, address=?, height=?, weight=? where p_id=?', [req.body.email, req.body.name, req.body.ph_no, req.body.dob, req.body.sex, req.body.address, req.body.height, req.body.weight, req.id]);

        res.json({ 'result': "ok" });
    }
    catch (e) { res.status(500).json({ 'result': "Internal Server Error" }); }


});

router.delete('/delete/doctor', auth('doctor'), async function (req, res, next) {

    //DELETE DOCTOR PROFILE
    try {
        const [rows] = await db.query('delete from doctor where d_id=?', [req.id]);
        res.json({ 'result': "ok" });
    }
    catch (e) { res.status(500).json({ 'result': "Unable to Delete" }); }


});

router.delete('/delete/patient', auth('patient'), async function (req, res, next) {

    //DELETE PATIENT PROFILE
    try {
        const [rows] = await db.query('delete from patient where p_id=?', [req.id]);
    }
    catch (e) { res.status(500).json({ 'result': "Unable to Delete" }); }
})
module.exports = router;