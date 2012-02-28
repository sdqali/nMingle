var vows = require('vows');
var assert = require('assert');
var sinon = require('sinon');
var Mingle = require(__dirname + '/../lib/mingle');
var API = require(__dirname + '/../lib/api');
var Project = require(__dirname + '/../lib/project');
var Utils = require(__dirname + '/../lib/utils');

vows
    .describe('Mingle')
    .addBatch({
		  'general stuff': {
		      topic: new Mingle({
					    api: "some object"
					}),

		      'should know about api base': function(mingle) {
			  assert.equal(mingle.api_base, "/api/v2/");
		      },

		      'should know about API': function(mingle) {
			  assert.equal(mingle.api, "some object");
		      }
		  },
		  'app context': {
		      topic:  new Mingle({
					     appContext: "/foobar"
					 }),
		      'api base should have app context': function(mingle) {
			  assert.equal(mingle.api_base, "/foobar/api/v2/");
		      },
		      'dont bother with app context specified as "/"': function() {
			  var mingle = new Mingle({
						      appContext: "/"
						  });
			  assert.equal(mingle.api_base, "/api/v2/");
		      }
		  },

		  'getting projects': {
		      'should call GET on api': function() {
			  var mockApi = {
			      get: function(){}
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){});

			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "dont care"
						  });
			  mingle.getProjects();
			  assert(stubGet.calledOnce);
		      },

		      'should pass the correct path to api': function() {
			  var mockApi = {
			      get: function(path) {
			      }
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){
						      assert.equal(path, "/some_context/api/v2/projects.xml");
						  });

			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.getProjects(function(){});
			  assert(stubGet.calledOnce);
		      },

		      'should create a list of projects': function() {
			  var fakeCallback = function(projects, error){
			      assert.equal(projects.length, 2);
			      assert(projects[0] instanceof Project);
			      assert(projects[1] instanceof Project);
			  };
			  var mockApi = {
			      get: function(path, callback){
				  callback({
					       project: [
						   {
						       name: 'Foo',
						       identifier: 'foo'
						   },
						   {
						       name: 'Bar',
						       identifier: 'bar'
						   }
					       ]
					   }, null);
			      }
			  };
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.getProjects(fakeCallback);
		      }
		  },

		  'getting a project': {
		      'should call GET on api': function() {
			  var mockApi = {
			      get: function(){}
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){});
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "dont care"
						  });
			  mingle.getProject();
			  assert(stubGet.calledOnce);
		      },

		      'should pass the correct path to api': function() {
			  var mockApi = {
			      get: function(path) {
			      }
			  };
			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){
						      assert.equal(path, "/some_context/api/v2/projects/foobar.xml");
						  });
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.getProject("foobar", function(){});
			  assert(stubGet.calledOnce);
		      },

		      'should generate a project': function() {
			  var fakeCallback = function(project, error){
			      assert.equal(project.name, "Foo");
			      assert.equal(project.identifier, "foo");
			      assert(project instanceof Project);
			  };
			  var mockApi = {
			      get: function(path, callback){
				  callback({
					       name: 'Foo',
					       identifier: 'foo'
					   }, null);
			      }
			  };
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.getProject("foo", fakeCallback);
		      }
		  },

		  'creating a project': {
		      'should call POST on api': function() {
			  var mockApi = {
			      post: function() {},
			      get: function() {}
			  };

			  var stubPost = sinon.stub(mockApi, "post", function(path, callback){});
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "dont care"
						  });
			  var prj = {
			      name: "Foo Bar",
			      identifier: "foo_bar"
			  };
			  mingle.createProject(prj, function() {});
			  assert(stubPost.calledOnce);
		      },

		      'should pass the correct path to api': function() {
			  var mockApi = {
			      post: function(path) {
			      },
			      get: function(){}
			  };

			  var stubPost = sinon.stub(mockApi, "post", function(path, callback){
							assert.equal(path, "/some_context/api/v2/projects.xml");
						   });
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  var prj = {
			      name: "Foo Bar",
			      identifier: "foo_bar"
			  };
			  mingle.createProject(prj, function(){});
			  assert(stubPost.calledOnce);
		      },

		      'should pass the correct data to api': function() {
			  var prj = {
			      name: "Foo Bar",
			      identifier: "foo_bar",
			      description: "Awesome project",
			      template: false,
			      email_address: "jdoe@company.com",
			      email_sender_name: "John Doe",
			      date_format: "%d %D %Y",
			      time_zone: "Singapore",
			      precision: 4
			  };

			  var mockApi = {
			      post: function(path, data) {
				  assert.equal(data, Utils.toXml({project: prj}));
			      },
			      get: function() {}
			  };

			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.createProject(prj);
		      },

		      'needs at least name and identifier to create a project': function() {
			  var prj = {
			      rubbish: "Rubbish",
			      more_useless: "More Rubbish"
			  };

			  var mingle = new Mingle({
						      api: {},
						      appContext: "/some_context"
						  });

			  var callback = function(project, error) {
			      assert.equal(error.message, "At least name and identifier need to be provided to create a project");
			  };
			  mingle.createProject(prj, callback);
		      },

		      'should get the project created': function() {
			  var options = {
			      name: 'Foo',
			      identifier: 'foo'
			  };
			  var fakeCallback = function(project, error){
			      assert.equal(project.name, "Foo");
			      assert.equal(project.identifier, "foo");
			      assert(project instanceof Project);
			  };
			  var api = {
			      get: function(){},
			      post: function(path, data, callback){
				  callback();
			      }
			  };
			  var mingle = new Mingle({
						      api: api,
						      appContext: "/some_context"
						  });
			  var getProject = sinon.stub(mingle, "getProject");
			  mingle.createProject(options, fakeCallback);
			  assert(getProject.calledOnce);
		      }
		  },
		  'version info': {
		      'should call GET on api': function() {
			  var stubMethod = sinon.stub();
			  var mockApi = {
			      get: function(){} //stubMethod
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){});

			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "dont care"
						  });
			  mingle.info();
			  assert(stubGet.calledOnce);
		      },

		      'should pass the correct path to api': function() {
			  var mockApi = {
			      get: function(path) {
			      }
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path){
						      assert.equal(path, "/some_context/api/v2/info.xml");
						  });
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.info();
			  assert(stubGet.called);
		      },

		      'should pass the callback down': function() {
			  var mockApi = {
			      get: function(path) {
			      }
			  };

			  var dummyCallback = function(info) {
			  };

			  var stubGet = sinon.stub(mockApi, "get", function(path, callback){
						       assert.equal(callback, dummyCallback);
						   });
			  var mingle = new Mingle({
						      api: mockApi,
						      appContext: "/some_context"
						  });
			  mingle.info(dummyCallback);
			  assert(stubGet.called);
		      }
		  },

		  'projects converter': {
		      'should generate projects': function() {
			  var mingle = new Mingle({
						      api: "some object",
						      appContext: "/some_context"
						  });
			  var callback = function(projects, error) {
			      assert.equal(projects.length, 2);
			      assert(projects[0] instanceof Project);
			      assert.equal(projects[0].name, "Foo");
			      assert.equal(projects[0].identifier, "foo");
			      assert(projects[1] instanceof Project);
			      assert.equal(projects[1].name, "Bar");
			      assert.equal(projects[1].identifier, "bar");
			  };

			  var ps = {
			    project: [
				{
				    name: 'Foo',
				    identifier: 'foo'
				},
				{
				    name: 'Bar',
				    identifier: 'bar'
				}
			    ]
			  };
			  mingle.projectsConverter(callback)(ps, null);
		      }
		  },

		  'project converter': {
		      'should generate a project': function() {
			  var mingle = new Mingle({
						      api: "some object",
						      appContext: "/some_context"
						  });

			  var p = {
			      name: 'Foo',
			      identifier: 'foo'
			  };

			  var callback = function(project, error) {
			      assert(project instanceof Project);
			      assert.equal(project.name, 'Foo');
			      assert.equal(project.identifier, 'foo');
			  };
			  mingle.projectConverter(callback)(p, null);
		      }
		  }
	      }).export(module);