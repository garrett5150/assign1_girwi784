/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended:false}));

app.post('/login', function(req, res)
{
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');

    var username = req.body.un;
    var pw = req.body.pw;
    console.log("username: " + username + ", pw: " + pw);
});



var server = app.listen(3002,function(){
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});