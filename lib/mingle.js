var https = require('https');
var xml2js = require('xml2js');
var Project = require('./project');
var Utils = require('./utils');
var API = require('./api');

var parser = new xml2js.Parser({
				   explicitArray : false,
				   ignoreAttrs   : true,
				   explicitRoot  : false
			       });

var syncAttributes = Utils.syncAttributes;

var Mingle = function(options) {
    this.host = options.host;
    var credentials =  options.username + ":" + options.password;
    this.auth = 'Basic ' + new Buffer(credentials).toString('base64');
    this.api_base = "/api/v2/";
    if(options.appContext && options.appContext != "/") {
	this.api_base = options.appContext + "/api/v2/";
    }
    this.api = new API(https, this.host, this.auth);
};

Mingle.prototype = {
    getProjects: function(callback) {
	var path = this.api_base + "projects.xml";
	var converter = function(projects, err) {
	    var ps = projects.project.map(function(p) {
						  var blankProject = new Project({});
						  return syncAttributes(blankProject, p);
					      });
	    callback(ps, err);
	};
	this.api.get(path, converter);
    },

    getProject: function(id, callback) {
	var path = this.api_base + "projects/" +  id +".xml";
	var converter = function(project, err) {
	    var blankProject = new Project({});
	    callback(syncAttributes(blankProject, project), err);
	};
	this.api.get(path, converter);
    }
};

module.exports = Mingle;
