var express = require("express");
var settings = require("./settings");
var Streamer = require("./streamer");

var app = express(),
    streamer = new Streamer(settings);

app.get('/', function(req, res){
    res.send('Home page');
});

app.get('/stream.ogg', function(req, res){
    streamer.stream(req, res);
});

app.listen(3000);
