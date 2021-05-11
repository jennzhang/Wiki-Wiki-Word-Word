
//add form handler
document.addEventListener('DOMContentLoaded', bindRelatedPages);


// MVP is starting out without breaking out bindRelatedPages() into any further functions 

// bindRelatedPages()
// handler for populating the Related Wikipedia
// Pages Section
function bindRelatedPages() 
{
	// build api call
	// for MVP: alternate search terms "red lory" and "mount eerie" and "wide-body aircraft"
	let search_term = ""// update with integration to TFA microservice 

	// create div to house the term of the day content
	let termNode = document.createElement('div');
					
	// create linked page title
	let termHeader = document.createElement('h2');
	termHeader.classList.add('fw-light');
	let termTitleLink = document.createElement('a');
	termTitleLink.setAttribute('target', '_blank');	// set text in switch statement below

	// create page image
	// update code with image cropper microservice implementation
	let termImage = document.createElement('img');	// set src and alt in switch statement below

	// create page summary
	let termSummary = document.createElement('p');
	termSummary.classList.add('lead', 'text-muted');
	
	
	// alternate term by day of the week
	let today = new Date();
	// set content and attributes
	if ( today.getDay() == 1 )	// Mondays
	{
		search_term = "mount eerie";
		termTitleLink.href = "https://en.wikipedia.org/wiki/Mount_Eerie";
		termTitleLink.appendChild(document.createTextNode("Mount Eerie"));
		termImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Phil_Elverum_%28Mount_Eerie%29.jpg/220px-Phil_Elverum_%28Mount_Eerie%29.jpg";
		termImage.alt = "Phil Elverum performing as Mount Eerie in March 2012";
		termSummary.textContent = "Mount Eerie is the musical project of American songwriter and producer Phil Elverum. Elverum (also of the Microphones) is the principal member of the band, but has collaborated with many other musicians on his records and in live performances. Most of Mount Eerie's releases have been issued on Elverum's label P.W. Elverum & Sun, Ltd., and feature highly detailed packaging with his own artwork.";
	}
	else if( today.getDay() % 2 == 0 )	// Tuesdays, Thursdays, Saturdays
	{
		search_term = "red lory";
		termTitleLink.href = "https://en.wikipedia.org/wiki/Red_lory";
		termTitleLink.appendChild(document.createTextNode("Red Lory"));
		termImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Eos_bornea_-Taronga_Zoo%2C_Sydney%2C_Australia-8a_%281%29.jpg/220px-Eos_bornea_-Taronga_Zoo%2C_Sydney%2C_Australia-8a_%281%29.jpg";
		termImage.alt = "Red Lory";
		termSummary.textContent = "The red lory (Eos bornea) is a species of parrot in the family Psittaculidae. It is the second-most commonly kept lory in captivity, after the rainbow lorikeet.";
	}
	else	// Wednesdays, Fridays, Sundays
	{
		search_term = "wide-body aircraft";
		termTitleLink.href = "https://en.wikipedia.org/wiki/Wide-body_aircraft";
		termTitleLink.appendChild(document.createTextNode("Wide-body Aircraft"));
		termImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/A_380_meeting.jpg/220px-A_380_meeting.jpg";
		termImage.alt = "The Airbus A380 is the largest passenger aircraft.";
		termSummary.textContent = "A wide-body aircraft, also known as a twin-aisle aircraft, is an airliner with a fuselage wide enough to accommodate two passenger aisles with seven or more seats abreast.  The typical fuselage diameter is 5 to 6 m (16 to 20 ft). In the typical wide-body economy cabin, passengers are seated seven to ten abreast, allowing a total capacity of 200 to 850 passengers.";
	}
	
	// appends 
	termHeader.append(termTitleLink);
	termNode.appendChild(termHeader);
	termNode.appendChild(termImage);
	termNode.appendChild(termSummary);
	// call after getSearchResults returns: document.getElementById("term").appendChild(termNode);
	
	
	// format the search term. change any spaces to "%20"
	// split() citation: https://www.w3schools.com/jsref/jsref_split.asp
	// join() citation: https://www.w3schools.com/jsref/jsref_join.asp
	search_term = search_term.split(" ").join("%20");
	
	// get the related pages
	getSearchResults(search_term).then( resultsJSON => 
	{ 
		// for each result, print the title page as a subheading, 
		// linking to the Wikipedia page, then print the extract
		for ( const page in resultsJSON.pages )
		{
				document.getElementById("term").appendChild(termNode);
				// if the page is the same as the term of 
				// the day's page, skip it
				let search_term_spaces = search_term.split("%20").join(" ");
			
				if (!( search_term_spaces.toLowerCase() == resultsJSON.pages[page].title.toLowerCase() ))
				{
					let pageNode = document.createElement('div');
					
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
				
					// add to the new pageNode
					pageNode.appendChild(pageHeader);
					pageNode.appendChild(pageSummary);
				
				//add to the home page, based on index
				// condition for below switch logic: https://stackoverflow.com/questions/5464362/javascript-using-a-condition-in-switch-case
				switch ( true )	// resolves against booleans in case conditions
				{
					case page == "1" || page == "2"|| page == "3":
						pageNode.classList.add('wiki_page');
						// add to correct row
						document.getElementById("pages1to3").appendChild(pageNode);
						break;
					
					case page=="4" || page=="5" || page=="6":
						// specifiy col width and wiki_page class
						pageNode.classList.add('col-md-4', 'wiki_page');
						// add to correct row
						document.getElementById("pages4to6").appendChild(pageNode);
						break;
						
					case page == "7" || page == "8":
						// specifiy col width and wiki_page class
						pageNode.classList.add('col-md-6', 'wiki_page');
						// add to correct row
						document.getElementById("pages7to8").appendChild(pageNode);
						break;
						
					case page == "9" || page == "10":
						// specifiy col width and wiki_page class
						pageNode.classList.add('col-md-6', 'wiki_page');
						// add to correct row
						document.getElementById("pages9to10").appendChild(pageNode);
						break;
				}
			}
		}
	});
}	

function getSearchResults(search_term)
{
	let url = "http://flip2.engr.oregonstate.edu:7765/api/?search_term=";
	url =  url + search_term;

	// use fetch to send the request and get the results (Wikipedia pages)
	let response = fetch(url)
		.then(response => response.json())
		.catch(error => console.log(error.message));
	
	return response;
}