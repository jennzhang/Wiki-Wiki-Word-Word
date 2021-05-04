// Wiki Wiki Word Word Server 
// Jennifer Zhang (zhangjen@oregonstate.edu) CS361_Spring2021_400
// provides an api endpoint 
// serves page content as needed
// consumes teammates' microservices (see below for details) and serves distilled  content

const scraper = require('./scraper.js');
const express = require('express');

// set up app
const port = process.argv[2];
const rootDir = '/';
var app = express();
app.set('port', process.argv[2]);	// use with the forever process
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// add module for TFA microservices functions
// add module for Image_Cropper microservice functions

// functions
// split into module?


// routes
app.get( '/api', (req, res, next) => 
{
	
	const searchTerm = req.query.search_term;
	
	if (searchTerm) 
	{		
		scraper.getWikiSearchResults(searchTerm)
		.then( response => {console.log(response); res.send(response);} )
		.catch(next);	// errors | rejected promises move to 500 error handling
	} else {
		res.status(400).json({error: "Incorrect server call. Check your spelling and try again."});	//send a 409 status and with the error message
		return res.end();
	}
});

app.use( (req,res) => 
{
	res.status(404);
	return res.send('404');
});

app.use( (err, req, res, next) => 
{
	console.error(err.stack);
	res.status(500);
	return res.send('500');
});

app.listen(app.get('port'), () => 
{
	console.log( `Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.` );
});