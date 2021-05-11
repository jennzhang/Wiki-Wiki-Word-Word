
//add form handler
document.addEventListener('DOMContentLoaded', bindSearchForm);

// bindSearchForm()
// handler for the Wikipedia Search Gui form submission
// on submit, sends the search request to the Wiki Wiki 
// Word Word api and then shows the results in a modal
function bindSearchForm() 
{
	document.getElementById("search_form").onsubmit = e => {
		e.preventDefault();
		
		// build api call
		let search_term = document.getElementById("search_term").value; 
		// format the search term. change any spaces to "%20"
    // split() citation: https://www.w3schools.com/jsref/jsref_split.asp
    // join() citation: https://www.w3schools.com/jsref/jsref_join.asp
    search_term = search_term.split(" ").join("%20");
		
		getSearchResults(search_term).then( resultsJSON => 
		{
			// Get the results modal
			var modal = document.getElementById("resultsModal");

			var resultsList = document.getElementById("resultsList");
			// clear out any old data
			while ( resultsList.firstChild ) { resultsList.removeChild(resultsList.firstChild) };
			
			// add new data
			// if there are no results, display message 
			let results_string = "";
			if (resultsJSON.numResults == 0) 
			{ 
				results_string = "There are no results.";
				resultsList.textContent = results_string;
			}
			else
			{	
				// for each result, print the title page as a subheading, 
				// linking to the Wikipedia page, then print the extract
				for ( const page in resultsJSON.pages )
				{				
					let pageNode = document.createElement('p');
				
					// create linked page title
					let pageTitle = document.createElement('a');
					pageTitle.setAttribute('target', '_blank');
					let title = document.createTextNode(resultsJSON.pages[page].title);
					pageTitle.append(title);
					pageTitle.href = resultsJSON.pages[page].url;
				
					// create page summary
					let pageSummary = document.createElement('p');
					let summary = document.createTextNode(resultsJSON.pages[page].extract);
					pageSummary.append(summary);
				
				// add to the new pageNode
					pageNode.appendChild(pageTitle);
					pageNode.appendChild(pageSummary);
				
				//add to the modal
				document.getElementById("resultsList").appendChild(pageNode);
				}
			}
		
			// Show the modal
			modal.style.display = "block";

			// Get the <span> element that closes the modal
			var span = document.getElementById("closeResultsModalButton");

			// When the user clicks on <span> (x), empty the form inputs, then close the modal
			span.onclick = function() 
			{
					document.getElementById("search_term").value = "";
					modal.style.display = "none";
			}

			// When the user clicks anywhere outside of the modal, empty the form, close the modal
			window.onclick = function(event) 
			{
					if (event.target == modal) 
					{
							document.getElementById("search_term").value = "";
							modal.style.display = "none";
					}
			}
				})
				.catch ( error => alert(error) );
	}	
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

