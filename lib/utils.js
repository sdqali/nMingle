var Utils = {
    syncAttributes: function(first, second) {
	var target = {};
        for (var attrname in first) {
	    target[attrname] = first[attrname];
	};
	
        for (var attrname in second) {
	    target[attrname] = second[attrname];
	};
	return target;
    }  
};

module.exports = Utils;
