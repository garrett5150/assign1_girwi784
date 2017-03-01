/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var session = require('express-session');
var securerouter = express.Router();
var errorrouter = express.Router();
var indexrouter = express.Router();
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var sess;
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended: false}));
app.use(session({
    secret: 'ssshhhhh', proxy: true, resave: true, saveUninitialized: true
}));


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


//populates the feilds on secure.html
app.post('/generateuser', function (req, res) {
    sess = req.session;
    res.json({
        'login': sess.login,
        'pw': sess.password,
        'token': sess.token,
        'role': sess.role
    });
    return res.end();
});

//handles the login on 3001
app.post('/login', function (req, res) {


    sess = req.session;
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
            if (data.token == "abcd") {
                //sets login info to session
                sess.login = data.login;
                sess.password = data.pw;
                sess.role = data.role;
                sess.token = data.token;
                var fn = __dirname + '/secure/secure.html';
                res.sendFile(fn);
            } else {
                var fn = __dirname + '/public/error.html';
                res.sendFile(fn);
            }
        });
    }).end();
});

app.post('/addgenuser', function(req, res){
    sess = req.session;
    var post_options = {
        host: 'localhost',
        port: '3002',
        path: '/addgenuser',
        method: 'POST',
        headers: {
            "login": req.body.uname,
            "pw": req.body.psw,
            "role": "user",
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
            var fn = __dirname + '/secure/secure.html';
            res.sendFile(fn);
            //successful
        });
    }).end();
});

var server = app.listen(3001, function () {
    var host = server.address();
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});
