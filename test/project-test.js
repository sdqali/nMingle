var vows = require('vows');
var sinon = require('sinon');
var assert = require('assert');
var Project = require('../lib/project');
var Card = require('../lib/card');

vows
    .describe('Project')
    .addBatch({
		  'general stuff' : {
		      'should know about creator': function() {
			  var project = new Project({created_by: {name: "John Doe"}});
			  assert.equal(project.getCreator(), "John Doe");
		      },

		      'should know about the api connection': function() {
			  var api = function() {
			  };
			  var project = new Project({}, api);
			  assert.equal(project.api, api);
		      }
		  },

		  'cards': {
		      'getting a list of cards': {
			  'should call GET on api': function() {
			      var mockApi = {
				  get: function(){}
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(){});
			      var project = new Project({}, mockApi);
			      project.getCards();
			      assert(stubGet.calledOnce);
			  },

			  'should pass the cards path to api': function() {
			      var mockApi = {
				  get: function(){}
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(path, callback){
							   assert.equal(path, "/api/v2/projects/foo/cards.xml");
						       });
			      var project = new Project({identifier: "foo"}, mockApi);
			      project.getCards();
			      assert(stubGet.calledOnce);
			  },

			  'should get a list of cards': function() {
			      var mockApi = {
				  get: function(){}
			      };

			      var dummyCallback = function(cards, error) {
				  assert.equal(cards.length, 2);
				  assert(cards[0] instanceof Card);
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(path, callback){
							   callback({
									card: [
                                                                            {
										name: "Card 1",
										number: 1
									    },
									    {
										name: "Card 2",
										number: 2
									    }
									]
								    }, null);
						       });
			      var project = new Project({}, mockApi);
			      project.getCards(dummyCallback);
			      assert(stubGet.calledOnce);
			  }
		      },

		      'getting a specific card': {
			  'should call GET on API' : function(){
			      var mockApi = {
				  get: function(){}
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(){});
			      var project = new Project({}, mockApi);
			      project.getCard(1);
			      assert(stubGet.calledOnce);
			  },

			  'should pass path for a card': function(){
			      var mockApi = {
				  get: function(){}
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(path, callback){
							   assert.equal(path, "/api/v2/projects/foo/cards/234.xml");
						       });
			      var project = new Project({identifier: "foo"}, mockApi);
			      project.getCard(234);
			      assert(stubGet.calledOnce);
			  },

			  'should get a single card': function(){
			      var mockApi = {
				  get: function(){}
			      };

			      var dummyCallback = function(card, error) {
				  assert(card instanceof Card);
				  assert.equal(card.name, "Card 1");
				  assert.equal(card.number, 1);
			      };

			      var stubGet = sinon.stub(mockApi, "get", function(path, callback){
							   callback({
									name: "Card 1",
									number: 1
								    }, null);
						       });
			      var project = new Project({}, mockApi);
			      project.getCard(1, dummyCallback);
			      assert(stubGet.calledOnce);
			  }
		      }
		  }
	      }).export(module);