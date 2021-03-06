var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'QL_DauGia',
    password:'admin',
    host:'localhost',
    port: 5433,
    max:10,
    idleTimeoutMillis:30000,
};
var pool = new pg.Pool(config);
var server = require("http").Server(app);
var io = require("socket.io")(server);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
io.on("connection", function(socket){
    console.log("ket noi "+socket.io);
    socket.on("disconnect", function(){
        console.log(socket.io +"ngat ket noi ");
    });
    socket.on("clientsentdata", function(data){
        console.log(data);
        var user = data.split("/");
        pool.connect(function(err, client, done){
            if(err){
                return console.error("error ",err);
            }
            client.query("INSERT INTO taikhoan(tendn, matkhau) values('"+user[0].toString()+"','"+user[1].toString()+"')",function(err,result){
                done();
                if(err){
                    return console.error("error",err);
                    io.sockets.emit("serversentdata","khong the truy van");
                }else{
                    io.sockets.emit("serversentdata",result.rowCount);
                }
            });
        });
        
    });
});

    server.listen(3000,function(){
        console.log('server is listening in port 3000')
    });