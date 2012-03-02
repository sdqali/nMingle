Mingle = require('../lib/mingle');

var options ={
    host: "mingle.company.com",
    username: "user",
    password: "password"
};

var m = Mingle.create(options);
m.debug = true;

//get a project by identifier
m.getProject("project_id", function(project, err) {
		 console.log(project);
	     });

//get all the projects
m.getProjects(function(projects, err) {
		 console.log(projects.length,  'projects found');
	     });

//create a project
m.createProject({name: "Foobar", identifier: "foobar"}, function(project, err) {
		    if(!project) {
			console.log(err.message);
		    } else {
			console.log(project.getCreator());
		    }
		});

//Get version info
m.info(function(info, error){
	   console.log(info);
       });

//Get a card from a project
m.getProject("sample", function(project, err) {
		 project.getCard(1, function(card, error){
				     console.log(card);
				 });
	     });
