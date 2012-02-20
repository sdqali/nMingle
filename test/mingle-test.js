var vows = require('vows');
var assert = require('assert');
var Mingle = require('../lib/mingle');

vows
    .describe('Mingle')
    .addBatch({
		  'general stuff': {
		      topic: new Mingle({
					    host: "mingle.company.com",
					    username: "username",
					    password: "password"

					}),
		      'should know about host': function(mingle) {
			  assert.equal(mingle.host, "mingle.company.com");
		      },

		      'should know about correct auth credentials': function(mingle) {
			  var auth = 'Basic ' + new Buffer("username:password").toString('base64');
			  assert.equal(mingle.auth, auth);
		      },

		      'should not be able to reveal username and password': function(mingle) {
			  assert.isUndefined(mingle.username);
			  assert.isUndefined(mingle.password);
		      },

		      'should know about api base': function(mingle) {
			  assert.equal(mingle.api_base, "/api/v2/");
		      }
		  },
		  'app context': {
		      topic:  new Mingle({
					     appContext: "/foobar"
					 }),
		      'api base should have app context': function(mingle) {
			  assert.equal(mingle.api_base, "/foobar/api/v2/");
		      }
		      
		  }
	      }).export(module);