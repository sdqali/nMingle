var Project = function(options) {
    for (var attrname in options) {
	this[attrname] = options[attrname];
    }

};

Project.prototype = {
  getCreator: function() {
      return this.created_by.name;
  }  
};

module.exports = Project;