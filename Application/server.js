var express = require('express');
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended:false}));

var server = app.listen(3001,function(){
    var port = server.address().port;
    console.log("Server Started at http://%s%s", port);

});
