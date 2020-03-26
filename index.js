/* Require external APIs and start our application instance */
var express = require('express');
var app = express();
var request = require('request');

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

/* The handler for the /results route */
app.get('/results', function(req, res){
	console.log("Making Request!");
	var query = req.query.search;
	var key = "ISBN:" + query;
	var url = 'http://openlibrary.org/api/books?bibkeys=' + key + '&format=json&jscmd=details';
	console.log(url);
	request(url, function(error, response, dataStream){
		if (!error && response.statusCode == 200){
			console.log(dataStream);
			var data = JSON.parse(dataStream);
			console.log('data=',data);
			let img_url = data[key]["thumbnail_url"].split("-")[0]+"-M.jpg";
			let title = data[key].details.title;
			let authors = data[key].details.authors[0];
			let publish_date = data[key].details.publish_date;
			let bibkeys = data[key].bibkeys;

			res.render('results', {
				"data": data[key], 
				"img_url": img_url, 
				"title": title,
				"authors":authors,
				"publish_date": publish_date,
				"bibkeys": bibkeys
			});
		}
	});
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})