const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');


router.get('/view/doctor', auth('doctor'), async function (req, res, next) {

    //Search for patient and then view their PRESCRIPTIONS in a table
    //might need to make this a post request
    //disable upload report button

    // const [rows] = await db.query('select email,d_id from doctor');
    // res.json({'result' : rows});
});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

    // check patient and then view their reports in a table
    //Keep option to upload a report as well

});

router.post('/upload/doctor', auth('doctor'), async function (req, res, next) {

    //UPLOAD PRESCRIPTION HERE

});

module.exports = router;