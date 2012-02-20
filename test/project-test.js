var vows = require('vows');
var assert = require('assert');
var Project = require('../lib/project');

vows
    .describe('Project')
    .addBatch({
		  'project' : {
		      'should know about creator': function() {
			  var project = new Project({created_by: {name: "John Doe"}});
			  assert.equal(project.getCreator(), "John Doe");
		      }
		  }	  
	      }).export(module);