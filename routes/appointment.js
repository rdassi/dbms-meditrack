app.get('/route', async function (req, res, next) {
  
    const [rows] = await db.query('select email,d_id from doctor');
    res.json({'result' : rows});
    
  });