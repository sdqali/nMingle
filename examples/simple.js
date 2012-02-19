Mingle = require('../lib/mingle');

var options ={
    host: "mingle.company.com",
    username: "user",
    password: "password"
};

var m = new Mingle(options);
m.debug = true;
m.getProject("project_id", function(project, err) {
		 console.log(project.getCreator());
	     });

m.getProjects(function(projects, err) {
		 console.log(projects.length + "projects found");
	     });
