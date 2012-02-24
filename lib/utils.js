var Utils = {
    syncAttributes: function(first, second) {
        for (var attrname in second) {
	    first[attrname] = second[attrname];
	};
	return first;
    },
    toXml: function(data) {
    }
};

module.exports = Utils;
