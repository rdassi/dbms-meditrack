const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');

router.get('/view/doctor', auth('doctor'), async function (req, res, next) {

  // check DOCTOR and then view their APPOINTMENTS FOR THE DAY in a table
  try{
  const [rows] = await db.query('select app_id,app_confirm, app_slot,a.p_id, p.name, reason from appointment a, patient p where d_id=? and p.p_id=a.p_id;', [req.id]);
  res.json({'result' : rows});
  }
  catch{ res.status(500).json({"result": "server error"})}

});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

  // check patient and then view their APPOINTMENTS in a table
  const [rows] = await db.query('select app_id,app_confirm, app_slot,a.d_id, d.name, reason from appointment a, doctor d where p_id=? and d.d_id=a.d_id;', [req.id]);
  res.json({'result' : rows});
});

router.get('/list/patient', auth('patient'), async function (req, res, next) {

  // load all DOCTORS and their details for the patient to see and book appointment
  const [rows] = await db.query('select d_id,name,specialization,qualification,address from doctor', [req.id]);
  res.json({'result' : rows});
  
});

router.post('/book/patient', auth('patient'), async function (req, res, next) {

  // BOOK APPOINTMENT FOR PATIENT
  // SEE HOW TO ADD OPTION OF RESTRCITING TIME SLOTS
  //THROW ERROR IF APPOINTMENTS COINCIDE
  try{
  const [rows] = await db.query('insert into appointment (app_slot, app_confirm, p_id, d_id, reason) values(?)', [[req.body.slot, false, req.id, req.body.d_id, req.body.reason]]);
  res.json({'result' : 'ok'});
  }
  catch(e){ console.log(e); res.status(500).json({'result' : "SORRY NOT TODAY"}); }

});

router.put('/edit/doctor', auth('doctor'), async function (req, res, next) {

  // BOOK APPOINTMENT FOR PATIENT
  // SEE HOW TO ADD OPTION OF RESTRCITING TIME SLOTS
  //THROW ERROR IF APPOINTMENTS COINCIDE
  try{
  const [rows] = await db.query('update appointment set app_confirm=? where app_id=?', [req.body.app_confirm, req.body.app_id]);
  res.json({'result' : 'ok'});
  }
  catch(e){ console.log(e); res.status(500).json({'result' : "SORRY NOT TODAY"}); }

});


module.exports = router;