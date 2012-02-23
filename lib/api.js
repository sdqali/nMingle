var https = require('https');
var xml2js = require('xml2js');
var utils = require(__dirname + '/utils');

var parser = new xml2js.Parser({
				   explicitArray : false,
				   ignoreAttrs   : true,
				   explicitRoot  : false
			       });

var API = function(https, host, auth) {
    this.https = https;
    this.host = host;
    this.auth = auth;
};

API.prototype = {
    options: {
	host: this.host	
    },
    get: function(path, callback) {
	this.request("GET", path, callback);
    },

    request: function(method, path, callback) {
	var options = {
	    host: this.host,
	    path: path,
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

module.exports = API;