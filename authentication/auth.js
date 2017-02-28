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

app.post('/addgenuser', function(req, res){
    console.log(req.headers.login);
    var temp = createUser(req.headers.login, req.headers.pw, req.headers.role, "abcd");
    if (temp == "true")
    {
        res.json({'success': "true"});
        return res.end();
    }else{
        res.json({'success': "false"});
        return res.end();
    }
});

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
                if(temp.login == req.headers.login)
                {
                    if(temp.pw == req.headers.pw)
                    {
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
                res.json({ 'login': false, pw: 'false', 'token': false, 'role':false });
                return res.end();
        }
        });
});



var server = app.listen(3002,function(){
    var port = server.address().port;
    console.log("Server Started at http://localhost:%s", port);
});

function createUser(username, password, rol, tok)
{
    var obj = {table: []};
    //reads the files current users and appends the new user.
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data){
       if(err)
       {
           console.log(err);
           return "false";
       }else{
           obj = JSON.parse(data);
           obj.table.push({login:username, pw:password, role:rol, token:tok});
           var json = JSON.stringify(obj);
           fs.writeFile('users.json', json, 'utf8');
           return "true";
       }
    });
}






 //res.set('Access-Control-Allow-Origin', 'http://localhost:3001');