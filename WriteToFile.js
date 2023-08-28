const newman = require('newman'); 	//node scripts/WriteToFile.js в папке node.js
const fs = require('fs');

const org = "FSO";		//Поменять название ведомства

org_inuse = org;
if(org == "FSO") {
org_inuse="FSB";}

fs.readdir("scripts/"+org, function(err, files) {	// Очистка папки
    if (err) {
       console.log(err);
    } else {
       if (!files.length) {
           console.log("Folder is empty");
       } else {
			console.log(files);
			console.log("Deleted");
			files.forEach(files => 
			fs.unlinkSync("scripts/"+org+"/"+files)
			);
        }
    }
});

const names = [];
names.push("Name1", "Name2", "Name3", "Name4", "Name5", "Name6", "Name7", "Name8");	//Поменять название матчей
// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require("./"+org_inuse+"Tickets.postman_collection.json"),
    reporters: 'cli',
	environment: require('./TestEnv.json'),
	iterationData: require("./Tickets"+org_inuse+".json"),
	iterationCount: names.length
}).on('request', (error, data) => {
	if (error) {
		console.log(error);
		return;
	}
	console.log(data);

	if (data.cursor.position == 1)
	{
		const filename = "./scripts/"+org+"/"+org+" "+names[data.cursor.iteration]+".zip";
		const content = data.response.stream;
		
		fs.writeFile(filename, content, function(error) {
			if (error) {
				console.error(error);
			}
		});
	}
});
