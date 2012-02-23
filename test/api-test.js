var vows = require('vows');
var assert = require('assert');
var API = require('../lib/api');

vows
    .describe('API')
    .addBatch({
		  'general stuff': {
		      'should know about host': function() {
			  var api = new API(null, "example.com", null);
			  assert.equal(api.host, "example.com");
		      },
		      'should know about auth': function() {
			  var auth =  'Basic ' + new Buffer("username:password").toString('base64');
			  var api = new API(null, null, auth);
			  assert.equal(api.auth, auth);
		      },
		      'passes options down to request': function() {
			  var auth =  'Basic ' + new Buffer("username:password").toString('base64');
			  var passedOptions = {
			      host: "example.com",
			      path: "/",
			      method: "GET",
			      headers: {
				  "Accept"         : "application/xml",
				  "Host"           : "example.com",
				  "Connection"     : "keep-alive",
				  "Content-Length" : 0,
				  "Authorization" : auth
			      }
			  };
			  
			  var https = {
			      request: function(options, someFunction){
				  assert.deepEqual(options, passedOptions);
			      }
			  };
			  var api = new API(https, "example.com", auth);
			  api.get("/", function() {});
		      }
		  }
	      }).export(module);