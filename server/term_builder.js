// CS361_Spring2021_400 - Jennifer Zhang
// Term Builder module:
// takes in a url and builds an object with the 
// Wiki Wiki Word Word Term of the Day data

const fetch = require('node-fetch');	// third party lib for web calls (in other places for the project, used request and also can use "http" library's http.get... trying all these options)
const DOMParser = require('xmldom').DOMParser;	// third party lib for DOM parsing: https://www.npmjs.com/package/xmldom

module.exports.getTerm = getTerm;

// example call of getTerm():
// termLink.getUrl()
// 	.then(url => 
// 	{
// 		termBuilder.getTerm(url)
// 			.then( term => console.log(term) )
// 			.catch(error => console.log(error));
// 	})
// 	.catch(error => console.log(error));
function getTerm(url)
{	
	// term of the day object
	let term = {};
	
	return getPageHTML(url)
					.then( html => 
					{
						term.url = getUrl(html);
						term.title = getTitle(term.url);
						term.image = getImageInfo(html);
					
						// sometimes there is no image, check for type png, jpg, jpeg. 
						// if no image, then replace source with ""
						if (! (term.image.src.toLowerCase().includes("jpeg")
								|| term.image.src.toLowerCase().includes("png")
								|| term.image.src.toLowerCase().includes("jpg")) )
							term.image.src = "";
	
						// sometimes there is no image alt text: provide new alt text
						if ( !term.image.alt )
						{
							if ( term.image.src )
								term.image.alt = term.title + ": {Wikipedia does not have alt text for this image}";
						}
						return term; 
					})
					.then( term => 
					{
						return getExtract(term.url)
							.then( extract => 
							{
								term.extract = extract;
								return term;
							})
							.catch(error => console.log(error));
					})
					.catch(error => console.log(error));
}

// getPageHTML(url):
// grabs the HTML for Wikipedia page 
// of the url argument
function getPageHTML(url)
{
	// use fetch to send the request and get the results (Wikipedia pages)
	return fetch(url)
		.then(response => response.text())		// transform to response body to text
		.catch(error => console.log(error.message));
}

// getUrl():
// gets the canonical url for the page
// as there are sometimes redirects until
// a final content page 
function getUrl(html)
{
	// get a DOM parser
	const parser = new DOMParser();

	// get the links in the head tag
	const headLinks = parser
											.parseFromString(html, "text/html")
											.getElementsByTagName('head')[0]
											.getElementsByTagName('link');

	// get the link that has attribute rel: "canonical" 
	for ( link in headLinks )
	{
		if ( headLinks[link].getAttribute('rel') == "canonical" )
			// return the href of the canonical link
			return headLinks[link].getAttribute('href');
	}
}

// convertUrlEncodings():
// helper function to convert any url encodings
// in the string argument into the correct
// character
function convertUrlEncodings(url)
{
	let newUrl = url;
	
	// encodings for limited special characters (from encodings "%20" to "%2F" only)
	const encodings = 
	{
		"%20": " ", 
		"%21": "!", 
		"%22": "\"",
		"%23": "#", 
		"%24": "$",
		"%25": "%", 
		"%26": "&", 
		"%27": "'", 
		"%28": "{", 
		"%29": ")", 
		"%2A": "*", 
		"%2B": "+", 
		"%2C": ",", 
		"%2D": "-", 
		"%2E": ".", 
		"%2F": "/"
	}
		
	for (const key in encodings) 
	{
		newUrl = newUrl.split( key ).join( encodings[key] );
	}
	
	return newUrl;
}

// getTitle(url):
// gets the page title, which is part of the url arg
function getTitle(url)
{
	// format the page title so that underscores become spaces
	// replace() citation: https://www.w3schools.com/jsref/jsref_replace.asp
	// split() citation: https://www.w3schools.com/jsref/jsref_split.asp
	// join() citation: https://www.w3schools.com/jsref/jsref_join.asp
	return convertUrlEncodings(url.replace("https://en.wikipedia.org/wiki/", "").split( "\\" ).join( "" ));
}

// getExtract(url):
// gets the page's extract (2 sentences max)
function getExtract(url)
{
	// format the page title
	let pageTitle = url.replace("https://en.wikipedia.org/wiki/", "");
	
	// call Wikipedia's API for the page's extract
	var wikiAPISearchUrl = "https://en.wikipedia.org/w/api.php";

	var params = 
	{
		action: "query",
		format: "json",
		prop: "extracts",
		exsentences: "2",				// extract max sentences
		exintro: "1",					// boolean: if the parameter is specified, regardless of value, it is considered true
		explaintext: "1",				// also a boolean parameter
		titles: pageTitle
	};

	// for unauthenticated CORS request, set the origin parameter t0 "*"
	// citation: https://www.mediawiki.org/wiki/API:Cross-site_requests
	wikiAPISearchUrl = wikiAPISearchUrl + "?origin=*";
	Object.keys(params).forEach( key => {wikiAPISearchUrl += "&" + key + "=" + params[key];});
	
	// note: using the (node-)fetch as recommended by the Wikipedia API instead of an XMLHttpRequest object for brevity. MDN citation, if needed: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	return fetch(wikiAPISearchUrl)
		.then( wikiResponse => wikiResponse.json())
		.then( wikiResponseJSON => wikiResponseJSON.query.pages[Object.keys(wikiResponseJSON.query.pages)[0]].extract )
		.catch( error => {console.log(error);});
}

// getImageInfo():
// for the term of the day: get the image
// link and alt text from Wikipedia
function getImageInfo(html)
{
	// get a DOM parser
	const parser = new DOMParser();

	// get the first image tag in the body content div
	const images = parser
											.parseFromString(html, "text/html")
											.getElementById("bodyContent")
											.getElementsByTagName('img');
	
	// if exists, get the image that is most likely the best one: 										
	if ( images.length > 0)
	{
		let img = images[0];
		
		// sometimes the image is for a special note for the page 
		// skip this small image and check for another
		// edge case: question mark book (out of scope: how to 
		// best deal with edge cases, systematically)
		if ( img.getAttribute("width") < 50 
				|| (img.getAttribute("src").includes("Question_book-new.svg")))
		{
			if ( images.length > 1 )
			{
				img = images[1];
				// return the image info: image link and image alt text
				return image = 
					{
						src: img.getAttribute('src'),
						alt: img.getAttribute('alt')
					};
			}
			else return image = { src: "", 
														alt: "" 
													};
		}
		// future scope: redo all these returns
		return image = 
					{
						src: img.getAttribute('src'),
						alt: img.getAttribute('alt')
					};
	}
	else return image = { src: "", 
												alt: "" 
											};
}