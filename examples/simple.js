Mingle = require('../lib/mingle');

var options ={
    host: "mingle.company.com",
    username: "user",
    password: "password"
};

var m = Mingle.create(options);
m.debug = true;
m.getProject("project_id", function(project, err) {
		 console.log(project);
	     });

m.getProjects(function(projects, err) {
		 console.log(projects.length,  'projects found');
	     });

m.createProject({name: "Foobar", identifier: "foobar"}, function(project, err) {
		    if(!project) {
			console.log(err.message);
		    } else {
			console.log(project.getCreator());
		    }
		});