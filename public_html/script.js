// CS361_Spring2021_400 - Jennifer Zhang
// main Wiki Wiki Word Word home page script
// major features: 
// 1. get term of the day info, which is distilled 
// from the links in the content from the Today's 
// Featured Article microservice. There is a fail-
// safe in place in case the microservice call 
// fails, then there is custom code in the 
// 'tfa_impl.js' module to get manually get the TFA 
// info from Wikipedia. There is also backup code 
// in this unit in case calls to Wikipedia are not 
// working. 
// 2. get the related pages by calling the WWWW 
// Wikipedia search endpoint and passing the term
// of the day
// 3. the home page seeds getting the cropped image
// for the header. The header image's file is 
// overwritten with a new cropped image by calling
// the image cropper microservice and passing in the 
// original image file. Once the cropped image is 
// returned, it is saved as the cropped image file, 
// overwriting the current file

//add form handler
document.addEventListener('DOMContentLoaded', bindRelatedPages);


// bindRelatedPages()
// handler for populating the Related Wikipedia
// Pages Section
function bindRelatedPages() 
{
	// get Term of the Day's info
	getTerm()
	.then(term => 
	{
		console.log(term);
		return buildTerm(term);
	})
	.then(searchTerm =>
	{
		buildRelatedPages(searchTerm);
	})
	.catch(error => 
	{
		console.log(error);
		buildTerm(getBackup());	// build with backup
	});
}	

// getTerm():
// hits the WWWW server endpoint /term_of_the_day
// which calls the TFA microservice to get 
// Wikipedia's Today's Featured Article. From the 
// Featured Article's link, get and parse page html,
// and use one of the links (fourth from last in the
// first body paragraph, arbitrarily) as the term of
// the day. From the term of the day's page, get the
// term of the day image info, if exists, and call
// Wikipedia's api to get the short summary (Wikipedia
// calls it the extract) of the page. The WWWW server
// endpoint delivers the term of the day info as the 
// response payload.
function getTerm()
{
	let url = "http://flip2.engr.oregonstate.edu:7765/term_of_the_day";

	// use fetch to send the request and get the results (Wikipedia pages)
	return fetch(url)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// getBackup():
// returns term of the day info as a backup in case
// getTerm() fails
function getBackup()
{
	// declare term info object
	let termObj = {};
	
	// alternate term by day of the week
	let today = new Date();
	
	// set term info content and attributes
	if (today.getDay() == 1)	// Mondays
	{
		termObj.title = "Mount Eerie";
		termObj.href = "https://en.wikipedia.org/wiki/Mount_Eerie";
		termObj.imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Phil_Elverum_%28Mount_Eerie%29.jpg/220px-Phil_Elverum_%28Mount_Eerie%29.jpg";
		termObj.imageAlt = "Phil Elverum performing as Mount Eerie in March 2012";
		termObj.extract = "Mount Eerie is the musical project of American songwriter and producer Phil Elverum. Elverum (also of the Microphones) is the principal member of the band, but has collaborated with many other musicians on his records and in live performances. Most of Mount Eerie's releases have been issued on Elverum's label P.W. Elverum & Sun, Ltd., and feature highly detailed packaging with his own artwork.";
	}
	else if(today.getDay() % 2 == 0)	// Tuesdays, Thursdays, Saturdays
	{
		termObj.title = "Red Lory";
		termObj.href = "https://en.wikipedia.org/wiki/Red_lory";
		termObj.imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Eos_bornea_-Taronga_Zoo%2C_Sydney%2C_Australia-8a_%281%29.jpg/220px-Eos_bornea_-Taronga_Zoo%2C_Sydney%2C_Australia-8a_%281%29.jpg";
		termObj.imageAlt = "Red Lory";
		termObj.extract = "The red lory (Eos bornea) is a species of parrot in the family Psittaculidae. It is the second-most commonly kept lory in captivity, after the rainbow lorikeet.";
	}
	else	// Wednesdays, Fridays, Sundays
	{
		termObj.title = "Wide-body Aircraft";
		termObj.href = "https://en.wikipedia.org/wiki/Wide-body_aircraft";
		termObj.imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/A_380_meeting.jpg/220px-A_380_meeting.jpg";
		termObj.imageAlt = "The Airbus A380 is the largest passenger aircraft.";
		termObj.extract = "A wide-body aircraft, also known as a twin-aisle aircraft, is an airliner with a fuselage wide enough to accommodate two passenger aisles with seven or more seats abreast.  The typical fuselage diameter is 5 to 6 m (16 to 20 ft). In the typical wide-body economy cabin, passengers are seated seven to ten abreast, allowing a total capacity of 200 to 850 passengers.";
	}
	return termObj;
}

// getSearchResults():
// hits the Wiki Wiki Word Word Wikipedia Search API
// to get the links and extracts to pagest that are
// related to the term of the day
function getSearchResults(searchTerm)
{
	let url = "http://flip2.engr.oregonstate.edu:7765/api/?search_term=";
	url =  url + searchTerm;

	// use fetch to send the request and get the results (Wikipedia pages)
	return fetch(url)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// buildRelatedPages():
// takes in a searchTerm and builds the html
// containing the results
function buildRelatedPages(searchTerm)
{
	// get the related pages
	getSearchResults(searchTerm)
	.then( resultsJSON => 
	{ 
		// for each result, print the title page as a subheading, 
		// linking to the Wikipedia page, then print the extract
		for ( const page in resultsJSON.pages )
		{
			// if the page is the same as the term of 
			// the day's page, skip it
			let searchTerm_spaces = searchTerm.split("_").join(" ");
			
			if (!( searchTerm_spaces.toLowerCase() == resultsJSON.pages[page].title.toLowerCase() ))
			{
				let relatedWikipediaPageDiv = document.createElement('div');
				
				// create linked page title
				let pageHeader = document.createElement('h2');
				pageHeader.classList.add('fw-light');
				let pageTitle = document.createElement('a');
				pageTitle.setAttribute('target', '_blank');
				let title = document.createTextNode(resultsJSON.pages[page].title);
				pageTitle.append(title);
				pageTitle.href = resultsJSON.pages[page].url;
				pageHeader.append(pageTitle);
				
			
				// create page summary
				let pageSummary = document.createElement('p');
				pageSummary.classList.add('lead', 'text-muted');
				let summary = document.createTextNode(resultsJSON.pages[page].extract);
				pageSummary.append(summary);
			
				// add to the new relatedWikipediaPageDiv
				relatedWikipediaPageDiv.appendChild(pageHeader);
				relatedWikipediaPageDiv.appendChild(pageSummary);
			
				//add to the home page, based on index
				let numPagesAdded = 0;
				
				if (numPagesAdded < 4) 
				{
					relatedWikipediaPageDiv.classList.add('col-md-4','wiki_page');
					// add to correct row
					document.getElementById("pages1to3").appendChild(relatedWikipediaPageDiv);
				}
				else if (numPagesAdded < 7)
				{
					relatedWikipediaPageDiv.classList.add('col-md-4','wiki_page');
					// add to correct row
					document.getElementById("pages4to6").appendChild(relatedWikipediaPageDiv);
				}
				else if (numPagesAdded < 9)
				{
					relatedWikipediaPageDiv.classList.add('col-md-6','wiki_page');
					// add to correct row
					document.getElementById("pages7to8").appendChild(relatedWikipediaPageDiv);
				}
				else
				{
					relatedWikipediaPageDiv.classList.add('col-md-6','wiki_page');
					// add to correct row
					document.getElementById("pages9to10").appendChild(relatedWikipediaPageDiv);
				}
			}
		}
	})
	.catch(error => console.log(error.message));
}

// buildTerm():
// takes the term of the day object
// and builds the DOM elements/tree to
// house those objects, then populates
// those objects' attributes with the 
// term object info
function buildTerm(termObj)
{
	// get div for the term of the day content
	let termNode = document.getElementById('term');
					
	// create linked page title
	let termHeading = document.getElementById('term_heading');
	
	// termHeading.classList.add('fw-light');
	let termTitleLink = document.createElement('a');
	termTitleLink.setAttribute('target', '_blank');	// set text in switch statement below
	termTitleLink.href = termObj.url;
	termTitleLink.appendChild(document.createTextNode(termObj.title));
	
	// create page image
	// update code with image cropper microservice implementation
	let termImage = document.createElement('img');	// set src and alt in switch statement below

	// create page summary
	let termSummary = document.createElement('p');
	termSummary.classList.add('lead', 'text-muted');

	// if the term of the day doesn't have an image, 
	// use the Wikipedia logo: https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/263px-Wikipedia-logo-v2.svg.png
	if (termObj.image.src == "")
	{
		termImage.src = "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/263px-Wikipedia-logo-v2.svg.png";
		termImage.alt = "The Term of the Day's Wikipedia's Page: no image to show"
	}
	else
	{
		termImage.src = termObj.image.src;
		termImage.alt = termObj.image.alt;
	}
	termSummary.textContent = termObj.extract;
	
	// appends 
	termHeading.append(termTitleLink);
	termNode.appendChild(termImage);
	termNode.appendChild(termSummary);
	
	// format the search term. change any spaces to "%20"
	// split() citation: https://www.w3schools.com/jsref/jsref_split.asp
	// join() citation: https://www.w3schools.com/jsref/jsref_join.asp
	return termObj.title.split(" ").join("%20");
}