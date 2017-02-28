/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var securerouter = express.Router();
var errorrouter = express.Router();
var indexrouter = express.Router();
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
var http = require('http');
var querystring = require('querystring');
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended: false}));


app.use('/secure', securerouter);
securerouter.route('/').post(function (req, res) {
    var fn = __dirname + '/secure/secure.html';
    res.sendFile(fn);
});

app.use('/error', errorrouter);
errorrouter.route('/').get(function (req, res) {
    var fn = __dirname + '/public/error.html';
    res.sendFile(fn);
});

app.use('/', indexrouter);
indexrouter.route('/').get(function (req, res) {
    var fn = __dirname + '/public/index.html';
    res.sendFile(fn);
});

app.post('/login', function (req, res) {

    var post_options = {
        host: 'localhost',
        port: '3002',
        path: '/login',
        method: 'POST',
        headers: {
            "login": req.body.uname,
            "pw": req.body.psw,
            'Content-Length': Buffer.byteLength()
        }
    };

    http.request(post_options).on('response', function (resp) {
        resp.setEncoding('utf8');
        var data = "";

        resp.on('data', function (chunk) {
            data = JSON.parse(chunk);
        });
        resp.on('end', function () {
            console.log(data);
            console.log(data.token);
            if (data.token == "abcd") {
                var fn = __dirname + '/secure/secure.html';
                res.sendFile(fn);
            } else {
                var fn = __dirname + '/public/error.html';
                res.sendFile(fn);
            }
        });
    }).end();

});

var server = app.listen(3001, function () {
    var host = server.address();
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});
