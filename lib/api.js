var https = require('https');
var xml2js = require('xml2js');
var utils = require(__dirname + '/utils');

var parser = new xml2js.Parser({
				   explicitArray : false,
				   ignoreAttrs   : true,
				   explicitRoot  : false
			       });

var API = function(https, host, auth, appContext) {
    this.https = https;
    this.host = host;
    this.auth = auth;
    this.appContext = "";
    if(appContext && appContext != "/") {
	this.appContext = appContext;
    }

};

API.prototype = {
    options: {
	host: this.host	
    },
    get: function(path, callback) {
	this.request("GET", path, null, callback);
    },
    post: function(path, data, callback) {
	this.request("POST", path, data, callback);
    },

    request: function(method, path, data, callback) {
	var options = {
	    host: this.host,
	    path: this.appContext + path,
	    method: method,
	    headers: {
		"Accept"         : "application/xml",
		"Host"           : this.host,
		"Connection"     : "keep-alive",
		"Content-Length" : 0,
		"Authorization" : this.auth
	    }
	};

	if (data) {
            options.headers["Content-Length"] = data.length;
            options.headers["Content-Type"]   = "application/xml";
	}

	var req = this.https.request(options, function(res) {
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
	if(data) {
	    return req.end(data);
	} else {
	    return req.end();
	}
    }

};

module.exports = API;