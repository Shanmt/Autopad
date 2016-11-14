var express = require('express');
var app = express();
var mysql = require("mysql");

var index = require('./route/index');
var remainder = require('./route/remainder');


app.use('/',index);
app.use('/remainder',remainder);


// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})



configure = require('./configure');
//default setters
config = configure.app();
$arr = {
    config : config
};

var server = app.listen(80, function () {

   var host = server.address().address
   var port = server.address().port
   
   console.log("AutoBan app listening at http://%s:%s", host, port)
})
