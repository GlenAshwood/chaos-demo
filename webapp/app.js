// var setup
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var ip = process.env.IP || "127.0.0.1";

// import local IP of the hosting server
var os = require('os');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// render landing page
app.get("/", function(req, res){
    res.render("landing");
});

//Listen port configuration
app.listen(port, function() {
    console.log('Ready on port ' + ip  + ' ' + port);
});
