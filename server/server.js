// Wiki Wiki Word Word Server 
// Jennifer Zhang (zhangjen@oregonstate.edu) CS361_Spring2021_400
// provides an api endpoint 
// serves page content as needed
// consumes teammates' microservices (see below for details) and serves distilled  content

const scraper = require('./scraper.js');		// WWWW Wikipedia Search scraper microservice
const termLink = require('./tfa_impl.js');		// TFA microservice implementation
const termBuilder = require('./term_builder.js'); 	// helper module to build the term of the day object
const cropper = require('./image_cropper_impl.js');	// Image Cropper microservice implementation
const cors = require('cors');	// Cross-Origin resource handler
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');		// for writing to local files

// set up app
const https_port = process.argv[2];
const http_port = process.argv[3];
const rootDir = '/';
const options = 	// for use with https calls
{
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var app = express();
//app.set('port', process.argv[2]);	// use with the forever process
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// middleware for serving static files
app.use(express.static('public'));

// routes ============================================

// Wikipedia search api endpoint
app.get( '/api', (req, res, next) => 
{
	const searchTerm = req.query.search_term;
	
	if (searchTerm) 
	{		
		scraper.getWikiSearchResults(searchTerm)
		.then( response => {res.send(response);} )
		.catch(next);	// errors | rejected promises move to 500 error handling
	}
	else 
	{
		res.status(400).json({error: "Incorrect server call. Check your spelling and try again."});	//send a 409 status and with the error message
		return res.end();
	}
});

// Integration with teammate's Today's Featured Article
// API: get the url from the microservice and send back
// JSON with info needed for the term of the day
app.get( '/term_of_the_day', (req, res, next) => 
{
	termLink.getUrl()
	.then(url => 
	{
		termBuilder.getTerm(url)
			.then( term => res.send(term) )
			.catch(error => console.log(error));
	})
	.catch(error => console.log(error));
});

// Integration with teammate's Image Cropper API
// get cropped image for the term of the day 
app.get( '/cropped_image', (req, res, next) => 
{
	const url = req.query.url;
	
	if (url)
	{
		cropper.getCroppedImage(url, () => 
		{
			res.send( 
			{
				image_url: "http://flip2.engr.oregonstate.edu:9295/images/cropped_image.jpg"
			})
		});
	} 
	else 
	{
		res.status(400).json({error: "Incorrect server call. Check your spelling and try again."});	//send a 400 status and with the error message
		return res.end();
	}
});

// middleware for error handling

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

// https server
https.createServer(options, app)
.listen(https_port, () => 
{
	console.log( `Express started on https://${process.env.HOSTNAME}:${https_port}; press Ctrl-C to terminate.` );
});


// http server
http.createServer(app)
.listen(http_port, () =>
{
	console.log( `Express started on http://${process.env.HOSTNAME}:${http_port}; press Ctrl-C to terminate.` );
});