/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended: false}));
var http = require('http');
var querystring = require('querystring');


app.post('/login', function (req, res) {
    var post_data = querystring.stringify({
        'login': req.body.un,
        'pw': req.body.pw
    });

    PostCode(post_data);

});


function PostCode(post_data) {


    var post_options = {
        host: 'localhost',
        port: '3002',
        path: '/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    post_req.write(post_data);
    post_req.end();
}



/*app.post('/login', function(req, res)
 {
 var response = {
 login:req.body.un,
 pw:req.body.pw
 };
 console.log(response);
 res.end(JSON.stringify(response));
 });*/


var server = app.listen(3001, function () {
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});
