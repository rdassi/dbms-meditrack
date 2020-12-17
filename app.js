
const { db } = require('./db')
const express = require('express')
const app = express()
const port = 3000
const user = require('./routes/auth');
const morgan = require('morgan');
app.use(morgan('tiny'));

app.use(express.static('static'));
app.use(express.json());
// LOGIN AND SIGN IN
app.use('/',user);

// APPOINTMENTS
var appointment= require('./routes/appointment');
app.use('/appointment',appointment);

//TEST REPORTS

//PROFILE PAGE

//PRESCRIPTION

// TEST RUN FOR APP.GET
// app.get('/test', (req, res) => {
//   res.json({
//     "message": "hello world"
//   })
// })

// var usersRouter = require('./routes/users');
// app.use('/users',usersRouter);
app.get('/doctor', async function (req, res, next) {
  
  const [rows] = await db.query('select email,d_id from doctor');
  res.json({'result' : rows});
  
});

app.get('/test/upload', async function (req, res, next) {
  
  const [rows] = await db.query('');
  res.json({'result' : rows});
  
});

  







app.get('/index', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/home', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/home.html'));
});

app.get('/appointment', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/appointment.html'));
});

app.get('/prescription', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/prescription.html'));
});

app.get('/test_report', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/test_report.html'));
});

app.get('/profile', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/static/profile.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})