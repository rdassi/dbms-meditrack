const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');


router.get('/view/patientlist', auth('doctor'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button
    try {
        const [rows] = await db.query('select distinct p.name,p.p_id from patient p, appointment a where p.p_id=a.p_id and a.d_id=?', [req.id]);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});

router.get('/view/doctorlist', auth('patient'), async function (req, res, next) {

    //Search for doctor and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button
    try {
        const [rows] = await db.query('select distinct d.name,d.d_id from  doctor d, appointment a where d.d_id=a.d_id and a.p_id=?', [req.id]);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});

router.get('/view/pres/doctor/:id', auth('doctor'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button
    try {
        // console.log(req.id)
        const [rows] = await db.query('select p.pres_id, date, d.name, symptoms, disease, comments from prescription p , patient d where p.d_id=? and p.p_id=? and d.p_id=p.p_id', [req.id, req.params.id]);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});


// view prescriptions for one patient by one doctor
router.get('/view/pres/patient/:did', auth('patient'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button
    try {//
        const [rows] = await db.query('select pres_id, date, d.name, symptoms, disease, comments from prescription p , doctor d where p.d_id=? and p.p_id=? and d.d_id=p.d_id', [req.params.did, req.id]);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});


// view all patient prescription
router.get('/view/pres/patient', auth('patient'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button
    try {//
        const [rows] = await db.query('select pres_id, date, d.name, symptoms, disease, comments from prescription p , doctor d where p.p_id=? and d.d_id=p.d_id', [req.id]);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});

router.get('/view/meds/doctor/:id', auth('doctor'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button

    try {
        const [rows] = await db.query('select med_id, medicine, dosage, directions from pharmacy where pres_id=?', req.params.id);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});

router.get('/view/meds/patient/:presId', auth('patient'), async function (req, res, next) {

    // check patient and then view their reports in a table
    //Keep option to upload a report as well
    try {
        const [rows] = await db.query('select med_id, medicine, dosage, directions from pharmacy p, prescription m where m.pres_id= p.pres_id and m.pres_id=?', req.params.presId);
        res.json({ 'result': rows });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }

});

router.post('/upload/pres/doctor', auth('doctor'), async function (req, res, next) {

    //UPLOAD PRESCRIPTION  HERE
    try {
        const [rows] = await db.query('insert into prescription (p_id, d_id, date, symptoms, disease, comments) values(?,?,NOW(),?,?,?)', [req.body.p_id, req.id, req.body.symptoms, req.body.disease, req.body.comments]);

        res.json({ 'result': "ok", "pres_id": [rows].pres_id });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }

});

router.post('/upload/meds/doctor', auth('doctor'), async function (req, res, next) {

    //UPLOAD MEDS HERE - CALLED MULTIPLE TIMES FOE EACH MED
    try {
        const [rows] = await db.query('insert into pharmacy (medicine, dosage, directions,pres_id) values(?)', [[req.body.medicine, req.body.dosage, req.body.directions, req.body.pres_id]]);

        // const [rows_pres_med] = await db.query('insert into pres_meds (pres_id,med_id) values=(?)', [req.body.pres_id,]);
        res.json({ 'result': "ok" });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }

});

router.delete('/delete/meds/doctor/:mid', auth('doctor'), async function (req, res, next) {

    //DELETE MEDS HERE 
    try {
        const [rows] = await db.query('delete from pharmacy where med_id=?', [req.params.mid]);
        res.json({ 'result': "ok" });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});

router.delete('/delete/pres/doctor', auth('doctor'), async function (req, res, next) {

    //DELETE WHOLE PRESCRIPTION HERE 
    try {
        const [rows] = await db.query('delete from prescription where pres_id=?', [req.body.presId]);
        res.json({ 'result': "ok" });
    }
    catch (e) {
        console.log(e); res.status(500).json({ 'result': "SERVER ERROR" });
    }
});


module.exports = router;