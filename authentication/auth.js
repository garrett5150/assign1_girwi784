/**
 * Created by Garrett Irwin on 2/25/2017.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended:false}));
var http = require('http');
var querystring = require('querystring');

app.post('/login', function(req, res)
{
    var errlog = [];
    var obj = {table:[]};
    console.log('Login: ' + req.body.login + ' Password: ' + req.body.pw);
    fs.readFile('users.json', 'utf8', function readFile(err, data){
        if(err)
        {
            console.log(err);
            throw err;
        }else {
            obj = JSON.parse(data);
            for (var i=0; i <= obj.table.length ; i++){
                var temp = obj.table.pop();
                if(temp.login == req.body.login)
                {
                    if(temp.pw == req.body.pw)
                    {
                        //login and password match the JSON file
                        //console.log("success!");
                        var post_data = querystring.stringify({
                            'login': temp.login,
                            'pw': temp.pw,
                            'token': temp.token
                        });
                        var data = JSON.stringify(post_data);
                        res.send(data);
                        //PostCode(post_data);
                    }else{
                        errlog.push("invalid Password");
                    }
                }else
                {
                    errlog.push("invalid Login");
                }
            }
        }
        });
});



var server = app.listen(3002,function(){
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});

function createUser(username, password, rol)
{
    var obj = {table: []};
    //reads the files current users and appends the new user.
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data){
       if(err)
       {
           console.log(err);
       }else{
           obj = JSON.parse(data);
           obj.table.push({login:username, pw:password, role:rol});
           var json = JSON.stringify(obj);
           fs.writeFile('users.json', json, 'utf8');
       }
    });
}

//function to send code to app server VIA post.
function PostCode(post_data) {


    var post_options = {
        host: 'localhost',
        port: '3001',
        path: '/success',
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






 //res.set('Access-Control-Allow-Origin', 'http://localhost:3001');