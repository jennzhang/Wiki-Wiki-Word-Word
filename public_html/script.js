
//add form handler
document.addEventListener('DOMContentLoaded', bindRelatedPages);

// bindRelatedPages()
// handler for populating the Related Wikipedia
// Pages Section
function bindRelatedPages() 
{
	// build api call
	let search_term = "tom hanks"// update with integration to TFA microservice 
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
				case page=="1" || page=="2":
					// console.log("1 TO 2: simulating add of page #" + page);
					// specifiy wiki_page class
					pageNode.classList.add('wiki_page');
					// add to correct row
					document.getElementById("pages1to2").appendChild(pageNode);
					break;
				case page=="3" || page=="4" || page=="5":
					// console.log("3 TO 5: simulating add of page #" + page);
					// specifiy col width and wiki_page class
					pageNode.classList.add('col-md-4', 'wiki_page');
					// add to correct row
					document.getElementById("pages3to5").appendChild(pageNode);
					break;
				case page=="6" || page=="7" || page=="8":
					// console.log("6 TO 8: simulating add of page #" + page);
					// specifiy col width and wiki_page class
					pageNode.classList.add('col-md-4', 'wiki_page');
					// add to correct row
					document.getElementById("pages6to8").appendChild(pageNode);
					break;
				case page=="9" || page=="10":
					// console.log("9 TO 10: simulating add of page #" + page);
					// specifiy col width and wiki_page class
					pageNode.classList.add('col-md-6', 'wiki_page');
					// add to correct row
					document.getElementById("pages9to10").appendChild(pageNode);
					break;
			}
		}
	});
}	

function getSearchResults(search_term)
{
	let url = "https://flip2.engr.oregonstate.edu:7764/api/?search_term=";
	url =  url + search_term;

	// use fetch to send the request and get the results (Wikipedia pages)
	let response = fetch(url)
		.then(response => response.json())
		.catch(error => alert(error.message));
	
	return response;
}