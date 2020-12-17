const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');

router.get('/view', auth('doctor'), async function (req, res, next) {
  
    const [rows] = await db.query('select email,d_id from doctor');
    res.json({'result' : rows});
    
  });

  module.exports=router;