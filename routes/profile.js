const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');

router.get('/view/doctor', auth('doctor'), async function (req, res, next) {

    //DISABLE- ADDRESS, HEIGHT, WEIGHT
    //ENABLE- SPECIALIZATION, QUALIFICATION
    //GET DOC INFO AND DISPLAY ON PAGE

    // const [rows] = await db.query('select email,d_id from doctor');
    // res.json({'result' : rows});

});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

    //DISABLE- SPECIALIZATION, QUALIFICATION
    //ENABLE- ADDRESS, HEIGHT, WEIGHT
    //GET PAT INFO AND DISPLAY ON PAGE

});

router.put('/edit/doctor', auth('doctor'), async function (req, res, next) {

    //DISABLE- ADDRESS, HEIGHT, WEIGHT
    //ENABLE- SPECIALIZATION, QUALIFICATION
    //UPDATE DOCTOR INFORMATION

});


router.put('/edit/patient', auth('patient'), async function (req, res, next) {

    //DISABLE- SPECIALIZATION, QUALIFICATION
    //ENABLE- ADDRESS, HEIGHT, WEIGHT
    //UPDATE PATIENT INFORMATION

});

router.delete('/delete/doctor', auth('doctor'), async function (req, res, next) {

    //DELETE DOCTOR PROFILE

});

router.delete('/delete/patient', auth('patient'), async function (req, res, next) {

    //DELETE PATIENT PROFILE

})
module.exports = router;