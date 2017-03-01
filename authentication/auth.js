/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var session = require('express-session');
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended: false}));
var http = require('http');
var querystring = require('querystring');
var indexrouter = express.Router();
var authlogin = express.Router();
var sess;

app.use(session({
    secret: 'ssshhhhh', proxy: true, resave: true, saveUninitialized: true
}));

app.post('/adduser', function (req, res) {
    createUser(req.body.uname, req.body.psw, req.body.role, "abcd");
    var fn = __dirname + '/secure.html';
    return res.sendFile(fn);
});

app.post('/removeuser', function (req, res) {
    removeUser(req.body.uname);
    var fn = __dirname + '/secure.html';
    return res.sendFile(fn);
});

app.post('/modifyuser', function (req, res) {
    modifyuser(req.body.olduname, req.body.newuname, req.body.oldpsw, req.body.newpsw, req.body.role);
    console.log(req.body.olduname, req.body.newuname, req.body.oldpsw, req.body.newpsw, req.body.role);
    var fn = __dirname + '/secure.html';
    return res.sendFile(fn);
});

app.use('/', indexrouter);
indexrouter.route('/').get(function (req, res) {
    var fn = __dirname + '/public/index.html';
    res.sendFile(fn);
});


app.post('/authlogin', function (req, res) {
    var success = 0;
    fs.readFile('users.json', 'utf8', function rdFile(err, data) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            var obj = JSON.parse(data);
            for (var i = 0; i < obj.table.length; i++) {
                var temp = obj.table[i];
                if (temp.login == req.body.uname) {
                    if (temp.pw == req.body.psw) {
                        //login and password match the JSON file
                        sess = req.session;
                        sess.login = temp.login;
                        sess.password = temp.pw;
                        sess.role = temp.role;
                        sess.token = temp.token;
                        success = 1;
                        var fn = __dirname + '/secure.html';
                        return res.sendFile(fn);
                    }
                }
            }
            var fn = __dirname + '/public/error.html';
            return res.sendFile(fn);
        }
    });
});


//generates the auth user session data
app.post('/generateauthuser', function (req, res) {
    sess = req.session;
    res.json({
        'login': sess.login,
        'pw': sess.password,
        'token': sess.token,
        'role': sess.role
    });
    return res.end();
});


//Code required for Application folder
//
//
//
//adding a generic user (not admin) for application/app.js
app.post('/addgenuser', function (req, res) {
    createUser(req.headers.login, req.headers.pw, req.headers.role, "abcd");
    return res.end();
});

//login function for application/app.js
app.post('/login', function (req, res) {
    var success = 0;
    //var obj = {table:[]};
    fs.readFile('users.json', 'utf8', function rdFile(err, data) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            var obj = JSON.parse(data);
            for (var i = 0; i < obj.table.length; i++) {
                var temp = obj.table[i];
                if (temp.login == req.headers.login) {
                    if (temp.pw == req.headers.pw) {
                        //login and password match the JSON file
                        success = 1;
                        res.json({
                            'login': temp.login,
                            'pw': temp.pw,
                            'token': temp.token,
                            'role': temp.role
                        });
                        return res.end();
                    }
                }
            }
            res.json({'login': false, pw: 'false', 'token': false, 'role': false});
            return res.end();
        }
    });
});
//
//
//
//END Application code


var server = app.listen(3002, function () {
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});

function removeUser(username) {
    var temp = {table: []};
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            for (var i = 0; i < obj.table.length; i++) {
                if (obj.table[i].login == username) {

                } else {
                    temp.table.push(obj.table[i]);
                }
            }
            var json = JSON.stringify(temp);
            fs.writeFile('users.json', json, 'utf8');
        }
    });
}

function modifyuser(oldusername, newusername, oldpw, newpw, role) {
    var temp = {table: []};
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                var obj = JSON.parse(data);
                for (var i = 0; i < obj.table.length; i++) {
                    if (obj.table[i].login == oldusername && obj.table[i].pw == oldpw) {
                            temp.table.push({
                                login: newusername,
                                pw: newpw,
                                role: role,
                                token: "abcd"
                            });
                    } else {
                        if (obj.table[i].login == oldusername) {
                            if(newusername != "")
                            {
                                temp.table.push({
                                    login: newusername,
                                    pw: obj.table[i].pw,
                                    role: role,
                                    token: "abcd"
                                });
                            }
                        }else{
                            if (obj.table[i].pw == oldpw) {
                                if(newpw != "")
                                {
                                    temp.table.push({
                                        login: obj.table[i].login,
                                        pw: newpw,
                                        role: role,
                                        token: "abcd"
                                    });
                                }
                            }else{
                                temp.table.push(obj.table[i]);
                            }
                        }
                    }

                }
                var json = JSON.stringify(temp);
                fs.writeFile('users.json', json, 'utf8');
            }
        });
}

function createUser(username, password, rol, tok) {
    var obj = {table: []};
    //reads the files current users and appends the new user.
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.table.push({
                login: username,
                pw: password,
                role: rol,
                token: tok
            });
            var json = JSON.stringify(obj);
            fs.writeFile('users.json', json, 'utf8');
        }
    });
}


//res.set('Access-Control-Allow-Origin', 'http://localhost:3001');