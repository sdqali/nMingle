var Project = function(name) {
  this.name = name;  
};

Project.prototype = {
  getCreator: function() {
      return this.created_by.name;
  }  
};

module.exports = Project;