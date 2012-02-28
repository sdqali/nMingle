var vows = require('vows');
var sinon = require('sinon');
var assert = require('assert');
var https = require('https');
var API = require('../lib/api');
var Utils = require('../lib/utils');

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
			      }
			  };

			  var stubRequest = sinon.stub(https, "request", function(options, callback){
							   assert.deepEqual(options, passedOptions);
							   return {
							       on: function(event, callback){},
							       end: function(data){
							       }
							   };
						       });
			  var api = new API(https, "example.com", auth);
			  api.get("/", function() {});
			  assert(stubRequest.calledOnce);
		      }
		  },
		  'post': {
		      'calls request on https': function() {
			  var api = new API(https, "", null);
			  var request = sinon.spy(https, "request");
			  api.post("/", "", function(){});
			  assert(request.calledOnce);
		      },
		      'passes data down to request with correct headers': function() {
			  var auth =  'Basic ' + new Buffer("username:password").toString('base64');
			  var passedOptions = {
			  };

			  var dummyXml = "<foo>bar</foo>";

			  var https =  {
			      request: function(options, callback){
			      }
			  };

			  var stubRequest = sinon.stub(https, "request", function(options, callback){
							   assert.equal(options.headers["Content-Length"], dummyXml.length);
							   assert.equal(options.headers["Content-Type"], "application/xml");
							   return {
							       on: function(event, callback){},
							       end: function(data){
								   assert.equal(data, dummyXml);
							       }
							   };
						       });
			  var api = new API(https, "example.com", auth);
			  api.post("/", dummyXml, function() {});
			  assert(stubRequest.calledOnce);
		      }
		  }
	      }).export(module);