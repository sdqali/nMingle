var vows = require('vows');
var assert = require('assert');
var Utils = require('../lib/utils');

vows
    .describe('Utils')
    .addBatch({
		  'sync attributes': {
		      topic: Utils,
		      'knows about fields from first and second': function(utils) {
			  var first = {
			      foo: "Foo"
			  };

			  var second = {
			      zoom: "Zoom"
			  };

			  var third = utils.syncAttributes(first, second);
			  assert.equal(third.zoom, "Zoom");
			  assert.equal(third.foo, "Foo");
		      },
		      'returns an object of the first type': function(utils) {
			  var first = function() {
			  };

			  var second = function() {
			  };

			  var third = utils.syncAttributes(new first(), new second());
			  assert(third instanceof first);
		      },
		      'does not alter the second': function(utils) {
			  var first = {
			      zoom: "Zoom"
			  };

			  var second = {
			      zoom: "Not Zoom"
			  };

			  var third = utils.syncAttributes(first, second);
			  assert.equal(second.zoom, "Not Zoom");
		      },
		      'keeps the second objects fields in case of duplicates': function(utils) {
			  var first = {
			      zoom: "Zoom"
			  };

			  var second = {
			      zoom: "Not Zoom"
			  };

			  var third = utils.syncAttributes(first, second);
			  assert.equal(third.zoom, "Not Zoom");
		      },
		      'copies methods': function(utils) {
			  var first = {
			      foo: "Foo"
			  };

			  var second = {
			      doSomething: function() {
				  return "booom";
			      }
			  };

			  var third = utils.syncAttributes(first, second);
			  assert.equal(third.doSomething(), second.doSomething());
		      }		      
		  }
	      }).export(module);