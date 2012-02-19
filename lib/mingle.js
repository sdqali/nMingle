var https = require('https');
var xml2js = require('xml2js');
var Project = require('./project');

var parser = new xml2js.Parser({
				   explicitArray : false,
				   ignoreAttrs   : true,
				   explicitRoot  : false
			       });


var syncAttributes = function(first, second) {
    for (var attrname in second) {
	first[attrname] = second[attrname];
    }
    return first;
};


var Mingle = function(options) {
    this.host = options.host;
    var credentials =  options.username + ":" + options.password;
    this.auth = 'Basic ' + new Buffer(credentials).toString('base64');
    this.api_base = "/api/v2/";
};

Mingle.prototype = {
    getProject: function(id, callback) {
	var fragments = ["projects", id];
	var converter = function(project, err) {
	    var blankProject = new Project("");
	    callback(syncAttributes(blankProject, project), err);
	};
	this.apiCall("GET", fragments, converter);
    },

    log: function(){
	if (this.debug) {
            console.log.apply(null, arguments);
	}
    },

    apiCall: function(method, urlFragments, callback) {
	var options = {
	    host: this.host,
	    path: this.api_base + urlFragments.join("/") + ".xml",
	    method: method,
	    headers: {
		"Accept"         : "application/xml",
		"Host"           : this.host,
		"Connection"     : "keep-alive",
		"Content-Length" : 0,
		"Authorization" : this.auth
	    }
	};

	var req = https.request(options, function(res) {
				    var content = "";
				    res.on('data', function(d) {
					       content += d;
					   });
				    
				    res.on('end', function(){
					   if (this.statusCode !== 200) {
					       return callback({code: this.statusCode, desc: "API returned an HTTP error"}, null);
					   } else {
					       parser.parseString(content, function (err, result) {
								      if (result && result.errors) {
									  err = result;
									  result = null;
								      }
								      return callback(result, err);
								  });

					   }
				       });

				});
	
	req.on('error', function(e) {
		   callback({
			  "errors" : {
			      "error" :[e]
			  }
		      }, null);
	       });
	req.end();
    }
};

module.exports = Mingle;
