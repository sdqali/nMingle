var https = require('https');
var xml2js = require('xml2js');
var Project = require(__dirname + '/project');
var Utils = require(__dirname + '/utils');
var API = require(__dirname + '/api');

var parser = new xml2js.Parser({
				   explicitArray : false,
				   ignoreAttrs   : true,
				   explicitRoot  : false
			       });

var syncAttributes = Utils.syncAttributes;

var Mingle = function(options) {
    this.api_base = "/api/v2/";
    if(options.appContext && options.appContext != "/") {
	this.api_base = options.appContext + "/api/v2/";
    }
    this.api = options.api;
};

Mingle.prototype = {
    getProjects: function(callback) {
	var path = this.api_base + "projects.xml";
	this.api.get(path, this.projectsConverter(callback));
    },

    getProject: function(id, callback) {
	var path = this.api_base + "projects/" +  id +".xml";
	this.api.get(path, this.projectConverter(callback));
    },

    createProject: function(options, callback) {
	if (!(options.name && options.identifier)) {
	    callback(null, {
			 message: "At least name and identifier need to be provided to create a project"
		     });
	} else {
	    var path = this.api_base + "projects.xml";
	    this.api.post(path, Utils.toXml(options), this.projectConverter(callback));
	}
    },

    projectsConverter: function(callback) {
	return function(projects, err) {
	    var ps = projects.project.map(function(p) {
					      var blankProject = new Project({});
					      return syncAttributes(blankProject, p);
					  });
	    callback(ps, err);
	};
    },

    projectConverter: function(callback) {
	return function(project, err) {
	    var blankProject = new Project({});
	    callback(syncAttributes(blankProject, project), err);
	};
    }
};

Mingle.create = function(options) {
    var credentials =  options.username + ":" + options.password;
    var auth = 'Basic ' + new Buffer(credentials).toString('base64');
    var api = new API(https, options.host, auth);
    return new Mingle({
			  api: api,
			  appContext: options.appContext
		      });
};

module.exports = Mingle;
