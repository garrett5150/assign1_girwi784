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
var success = 0;

app.post('/login', function(req, res)
{
    var errlog = [];
    var obj = {table:[]};
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
                        res.setHeader('Content-Type', 'application/json');
                        success = 1;
                        res.send(JSON.stringify({
                            'login': temp.login,
                            'pw': temp.pw,
                            'token': temp.token
                        }));
                    }else{

                    }
                }else
                {

                }
            }
            if (success == 0){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify('{ login: false, pw: false, token: false }'));
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






 //res.set('Access-Control-Allow-Origin', 'http://localhost:3001');