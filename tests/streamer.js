var assert = require("assert");
var sinon = require("sinon");
var icecast = require("icecast");
var Streamer = require("../sunday-server/streamer")


describe('streamer.js', function(){
    var streamer;
    beforeEach(function(){
	sinon.stub(icecast, "get");
	streamer = new Streamer({url: "url"});
    });
    afterEach(function(){
	icecast.get.restore();
    });

    describe('Streamer', function(){
	it('should get icecast URL on start', function(){
	    assert(icecast.get.calledWithMatch(streamer.url));
	});
	it('should add client', function(){
	    streamer.addClient(1, "response");
	    streamer.addClient(2, "response");
	    assert.equal(streamer.clients.length, 2);
	    streamer.addClient(1, "other");
	    assert.equal(streamer.clients.length, 2);
	    assert.equal(streamer.clients[0].response, "response");
	});
	it('should get client', function(){
	    var client;
	    streamer.addClient(1, "response1");
	    streamer.addClient(2, "response2");
	    client = streamer.getClient(1);
	    assert.equal(client.ip, 1);
	    assert.equal(client.response, "response1");
	    client = streamer.getClient(2);
	    assert.equal(client.ip, 2);
	    assert.equal(client.response, "response2");
        });
	it('should remove client', function(){
	    streamer.addClient(1, "response1");
	    streamer.addClient(2, "response2");
	    streamer.removeClient(1);
	    assert.equal(streamer.clients.length, 1);
	    streamer.removeClient(2);
	    assert.equal(streamer.clients.length, 0);
	});
	it('should stream response and add callbacks', function(){
	    var request = {
		connection: {
		    remoteAddress: 1,
		    on: sinon.stub()
		}
	    };
	    var response = {writeHead: sinon.spy()};
	    sinon.stub(streamer, "addClient");
	    sinon.stub(streamer, "removeClient");

	    streamer.stream(request, response);
	    sinon.assert.calledOnce(streamer.addClient);
	    sinon.assert.calledOnce(response.writeHead);
	    sinon.assert.calledOnce(request.connection.on);

	    // closing connexion
	    request.connection.on.callArg(1);
	    sinon.assert.calledWith(streamer.removeClient, 1);
	});
    });
});
