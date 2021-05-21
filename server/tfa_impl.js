// CS361_Spring2021_400 - Jennifer Zhang
// Today's Featured Article Microservice Integration module:
// gets Wikipedia's Today's Featured Article from the TFA 
// microservice and then:
// from the body text (first paragrah tag in html) 
// extracts the URL of the first link (another Wikipedia page) 
// returns the url. A builder module, the Term of the Day
// builder, will take this Wikipedia page and use it to   
// build the Wiki Wiki Word Word term of the day

const fetch = require('node-fetch');	// third party lib for web calls (in other places for the project, used request and also can use "http" library's http.get... trying all these options)
const DOMParser = require('xmldom').DOMParser;	// third party lib for DOM parsing: https://www.npmjs.com/package/xmldom

// exporting getUrl for this module
module.exports.getUrl = getUrl;

// example of module call commented below
//getUrl().then(url => console.log(url)).catch(error => console.log(error));


// getUrl():
// get the TFA url from the TFA microservice, or the fail-safe, if the microservice is down
function getUrl()
{
	return getTFAUrl()
	.then( TFAUrl =>
	{
		// if error getting the TFA Results from the TFA microservice
		if ( TFAUrl == "error" ) 
		{ 
			console.log("there was an error getting the TFA Results from the TFA microservice");
			
			// fall back to fail-safe
			return failSafe();
		}
		// otherwise, populate the page with the TFA Results link  
		else 
			return getTermLink(TFAUrl);
	})
	.catch(error => console.log(error));
}

// getTFAUrl():
// From the TFA microservice call's response, get 
// the url for Wikipedia's Today's Featured Article
function getTFAUrl()
{
	return getTFAResults()
		.then( TFAResults => 
		{
			if ( TFAResults == "error" ) { return "error"; }
			else
			{
				return TFAResults.url;
			}
		})
		.catch(error => console.log("error getting TFA results from the TFA microservice" + error));
}

// getTFAResults():
// call's teammate's microservice to get
// Wikipedia's Today's Featured Article data
function getTFAResults()
{
	let url = "https://cs361-wiki-tfa.wm.r.appspot.com/api/article";

	// use fetch to send the request and get the results (Wikipedia pages)
	let response = fetch(url)
		.then(response => response.json())
		.catch(error => ("error"));
	
	return response;
}

// failSafe():
// used as a fail-safe and is called when
// there is an error getting data from the 
// TFA microservice
function failSafe()
{
	const url = getWikiFAUrl();

	return getTermLink(url);
}

// getTermLink():
// gets the second to last link in the body of 
// Wikipedia's Today's Featured Article
// note: the first few links might be for 
// pronounciaton and the last link is the same 
// as the link to the full TFA
function getTermLink(url)
{
	// get a DOM parser
	const parser = new DOMParser();

	// get the first paragraph text for Wikipedia's Today's Featured Article
	let termLink = getWikiFAResults(url)
		.then( textHTML => 
		{	
			// get the parsedLink
			const paragraphsArray = parser
														.parseFromString(textHTML, "text/html")
														.getElementsByTagName('body')[0]
														.getElementsByTagName('p');
			for ( p in paragraphsArray )
			{ 
				let anchorNodes = paragraphsArray[p].getElementsByTagName('a');
				if ( anchorNodes.length > 0 ) 
					return "https://en.wikipedia.org" + anchorNodes[anchorNodes.length - 4].getAttribute('href');
			}
		})
		.catch(error => console.log(error));
	return termLink;
}

// getWikiFAResults(url):
// grabs the html for Wikipedia's 
// Today's Featured Article
function getWikiFAResults(url)
{
	// use fetch to send the request and get the results (Wikipedia pages)
	let response = fetch(url)
		.then(response => response.text())		// transform to response body to text
		.catch(error => console.log(error.message));
	
	return response;
}

// getWikiFAUrl():
// gets the Wikipedia Featured Article URL for 
// Today's Featured Article
function getWikiFAUrl()
{
	// get the Month (month name), Day (no padding), Year
	let today = new Date();
		 
	let monthNames = [
		"January", 
		"February", 
		"March", 
		"April", 
		"May", 
		"June",
		"July", 
		"August", 
		"September", 
		"October", 
		"November", 
		"December"
	];
	
	let month = monthNames[today.getMonth()];		// note: Date.getMonth() is 0 index'd
	month = month.charAt(0).toUpperCase() + month.slice(1)// capitalize first letter
	let day = today.getDate();
	let year = today.getFullYear();

	// build url
	// let url = "https://en.wikipedia.org/wiki/Wikipedia:Today%27s_featured_article/";
	// url = url + month + "_" + day + ",_" + year;
	let url = "https://en.wikipedia.org/wiki/Wikipedia:Today%27s_featured_article/June_16,_2021";
	
	return url;
}