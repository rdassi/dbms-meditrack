const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');

router.get('/view/doctor', auth('doctor'), async function (req, res, next) {

  // check DOCTOR and then view their APPOINTMENTS FOR THE DAY in a table

  // const [rows] = await db.query('select email,d_id from doctor');
  // res.json({'result' : rows});

});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

  // check patient and then view their APPOINTMENTS in a table

});

router.post('/book/patient', auth('patient'), async function (req, res, next) {

  // BOOK APPOINTMENT FOR PATIENT
  // SEE HOW TO ADD OPTION OF RESTRCITING TIME SLOTS
  //THROW ERROR IF APPOINTMENTS COINCIDE

});
module.exports = router;