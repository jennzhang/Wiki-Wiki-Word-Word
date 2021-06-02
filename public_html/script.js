// CS361_Spring2021_400 - Jennifer Zhang
// main Wiki Wiki Word Word home page script
// major features: 
// 1. get term of the day info: distil from
// the Today's Featured Article microservice 
// || use the fail-safe if microservice call 
// fails
// 2. get the related pages by calling the WWWW 
// Wikipedia pages search endpoint and passing 
// in the term of the day
// 3. get the updated term of the day heading 
// image file from the image cropper microservice

// form handler
document.addEventListener('DOMContentLoaded', bindRelatedPages);


// bindRelatedPages()
// handler for populating the Related Pages
function bindRelatedPages() 
{
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
// hits the WWWW server endpoint /term_of_the_day:
// which calls the TFA microservice to get 
// Wikipedia's Today's Featured Article url, 
// parses the TFA page html distill the term 
// of the day info
function getTerm()
{
	let url = "http://flip2.engr.oregonstate.edu:7765/term_of_the_day";

	return fetch(url)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// getBackup():
// returns backup term of the day info
// in case getTerm() call fails
function getBackup()
{
	let termObj = {};
	
	let today = new Date();
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
// hits the WWWW Search API endpoint to get 
// related pages info for the term of the day
function getSearchResults(searchTerm)
{
	let url = "http://flip2.engr.oregonstate.edu:7765/api/?search_term=";
	url =  url + searchTerm;

	return fetch(url)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// buildRelatedPages():
function buildRelatedPages(searchTerm)
{
	getSearchResults(searchTerm)
	.then( resultsJSON => 
	{ 
		// for each result, add the linked title and extract 
		for ( const page in resultsJSON.pages )
		{
			// if the page == term of the day's page, skip
			let searchTerm_spaces = searchTerm.split("_").join(" ");
			
			if (!( searchTerm_spaces.toLowerCase() == resultsJSON.pages[page].title.toLowerCase() ))
			{
				let relatedWikipediaPageDiv = document.createElement('div');
				
				let pageHeader = document.createElement('h2');
				pageHeader.classList.add('fw-light');
				let pageTitle = document.createElement('a');
				pageTitle.setAttribute('target', '_blank');
				let title = document.createTextNode(resultsJSON.pages[page].title);
				pageTitle.append(title);
				pageTitle.href = resultsJSON.pages[page].url;
				pageHeader.append(pageTitle);
				
				let pageSummary = document.createElement('p');
				pageSummary.classList.add('lead', 'text-muted');
				let summary = document.createTextNode(resultsJSON.pages[page].extract);
				pageSummary.append(summary);
			
				relatedWikipediaPageDiv.appendChild(pageHeader);
				relatedWikipediaPageDiv.appendChild(pageSummary);
			
				// add pages
				let numPagesAdded = 0;
				
				if (numPagesAdded < 4) 
				{
					relatedWikipediaPageDiv
									.classList.add('col-md-4','wiki_page');
					document.getElementById("pages1to3")
									.appendChild(relatedWikipediaPageDiv);
				}
				else if (numPagesAdded < 7)
				{
					relatedWikipediaPageDiv
									.classList.add('col-md-4','wiki_page');
					document.getElementById("pages4to6")
									.appendChild(relatedWikipediaPageDiv);
				}
				else if (numPagesAdded < 9)
				{
					relatedWikipediaPageDiv
									.classList.add('col-md-6','wiki_page');
					document.getElementById("pages7to8")
									.appendChild(relatedWikipediaPageDiv);
				}
				else
				{
					relatedWikipediaPageDiv
									.classList.add('col-md-6','wiki_page');
					document.getElementById("pages9to10")
									.appendChild(relatedWikipediaPageDiv);
				}
			}
		}
	})
	.catch(error => console.log(error.message));
}

// buildTerm():
// build the term of the day html
function buildTerm(termObj)
{
	let termNode = document.getElementById('term');
					
	let termHeading = document.getElementById('term_heading');
	let termTitleLink = document.createElement('a');
	termTitleLink.setAttribute('target', '_blank');	
	termTitleLink.href = termObj.url;
	termTitleLink.appendChild(document.createTextNode(termObj.title));
	let termImage = document.createElement('img');
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
	
	return termObj.title.split(" ").join("%20");
}