var Card = require(__dirname + '/card');
var Utils = require(__dirname + '/utils');
var syncAttributes = Utils.syncAttributes;

var Project = function(options, api) {
    for (var attrname in options) {
	this[attrname] = options[attrname];
    }

    this.api = api;
};

Project.prototype = {
    getCreator: function() {
	return this.created_by.name;
    },
    getCards: function(callback) {
	var path = "/api/v2/projects/" + this.identifier + "/cards.xml";
	this.api.get(path, this.cardsConverter(callback));
    },
    getCard: function(cardNumber, callback) {
	var path = "/api/v2/projects/" + this.identifier + "/cards/" + cardNumber + ".xml";
	this.api.get(path, this.cardConverter(callback));
    },
    cardsConverter: function(callback) {
	return function(cards, err) {
	    var cs = cards.card.map(function(c) {
					   var blankCard = new Card({});
					   return syncAttributes(blankCard, c);
				       });
	    callback(cs, err);
	};
    },
    cardConverter: function(callback) {
	return function(card, err) {
	    var blankCard = new Card({});
	    callback(syncAttributes(blankCard, card), err);
	};
    }
};

module.exports = Project;