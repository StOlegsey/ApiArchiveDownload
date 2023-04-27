const newman = require('newman'); //														node scripts/WriteToFile.js в папке node.js
const fs = require('fs');

const org = "FSO";																					//Поменять название ведомства

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
names.push("Динамо", "Самара", "Ахмат", "Спартак", "Краснодар", "Сочи", "Локомотив", "Оренбург");	//Поменять название матчей
// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./FSBTickets.postman_collection.json'),									//Поменять коллекцию
    reporters: 'cli',
	environment: require('./TestEnv.json'),
	iterationData: require('./TicketsFSB.json'),													//Поменять входные данные
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
