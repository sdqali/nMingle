var jsontoxml = require('jsontoxml');

var Utils = {
    syncAttributes: function(first, second) {
        for (var attrname in second) {
	    first[attrname] = second[attrname];
	};
	return first;
    },
    toXml: function(data) {
	return jsontoxml.obj_to_xml(data);
    }
};

module.exports = Utils;
