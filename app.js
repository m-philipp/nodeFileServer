var express = require('express');

var app = express();

var fs = require('fs');

var mkdirp = require('mkdirp');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


app.use(multipartMiddleware);

app.get('/', function(req, res){
    console.log("called /");
    res.send(
            '<form action="/upload" method="post" enctype="multipart/form-data">'+
            '<input type="file" name="source">'+
            '<input type="submit" value="Upload">'+
            '</form>'
    );
});

app.post('/upload/:sid/:username', multipartMiddleware, function(req, res) {
    console.log(req.body, req.files);
    // don't forget to delete all req.files when done
    console.log(req.params.sid, req.params.username);

    var uploadDir = __dirname+"/uploads/" + req.params.sid + "/" + req.params.username + "/";
    var fileName = req.files.source.name;

    console.log(uploadDir);

    mkdirp(__dirname+"/uploads/" + req.params.sid + "/", function (err) {
        if (err){
            console.error(err)
            res.send(400, "Server Writting No Good");
        }
        else{
            mkdirp(uploadDir, function (err) {
                if (err){
                    console.error(err)
                    res.send(400, "Server Writting No Good");
                }
                else{
                    fs.rename(
                        req.files.source.path,
                            uploadDir+fileName,
                        function(err){
                            if(err != null){
                                console.log(err)
                                res.send(400, "Server Writting No Good");
                            } else {
                                res.send("ok!");
                            }
                        }
                    );
                }
            });
        }
    });


});

app.get('/info', function(req, res){
    console.log(__dirname);
    res.send("ok");
});

app.listen(8080);
console.log('connected to localhost....')