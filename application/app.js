/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var securerouter = express.Router();
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
var http = require('http');
var querystring = require('querystring');
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended: false}));


app.use('/secure', securerouter);
securerouter.route('/').get(function (req, res) {
    var fn = __dirname + '/secure/secure.html';
    res.sendFile(fn);
});


app.post('/login', function (req, res) {
    var post_data = querystring.stringify({
        'login': req.body.un,
        'pw': req.body.pw
    });

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

    var post_req = http.request(post_options, function (resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            var token = JSON.parse(chunk);
            if (token.token == "abcd") {
                //req.session.token = "true"
                res.redirect("/secure");
            }
        });
    });
    post_req.write(post_data);
    post_req.end();
});

var server = app.listen(3001, function () {
    var host = server.address();
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});
