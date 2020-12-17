var express    = require("express");
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'risha',
   password : 'risha',
   database : 'MediTrack',
   port     : '3306'
 });
 var app = express();
 
 connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log(err);
     console.log("Error connecting database ... \n\n");  
 }
 });
app.listen(3000);