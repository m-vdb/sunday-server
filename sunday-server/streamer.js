var icecast = require("icecast");
var _ = require("underscore");

function Streamer(settings){
    this.settings = settings;
    this.url = settings.url;
    this.clients = [];

    this.start();
}

Streamer.prototype.start = function(){
    var self = this;
    icecast.get(self.url, function(res) {
	res.on('data', function(data) {
	    self.write(data);
	});
    });
};

Streamer.prototype.write = function(data){
    _.each(this.clients, function(client){
	client.response.write(data);
    });
};

Streamer.prototype.stream = function(request, response){
    var self = this, ip = request.connection.remoteAddress, headers = {
	"Content-Type": "audio/mpeg",
	"Connection": "close",
	"Transfer-Encoding": "identity"
    };

    console.log("Streamer.stream:: new client " + ip);
    if (!response.headers){
	response.writeHead(200, headers);
    }

    self.addClient(ip, response);

    request.connection.on("close", function(){
	console.log("Streamer.stream:: client " + ip + " left");
	self.removeClient(ip);
    });
};

Streamer.prototype.addClient = function(ip, response){
    if (!this.getClient(ip)){
	this.clients.push({response: response, ip: ip});
    };
}

Streamer.prototype.getClient = function(ip) {
    return _.findWhere(this.clients, {ip: ip});
};

Streamer.prototype.removeClient = function(ip){
    this.clients = _.reject(this.clients, function(client){ return client.ip == ip;});
};

module.exports = Streamer;
