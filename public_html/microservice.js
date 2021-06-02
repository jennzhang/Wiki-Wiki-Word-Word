// CS361_Spring2021_400 - Jennifer Zhang
// Microservice page script to for the  
// GUI version of the Wikipedia Pages 
// search microservice

// add form handler
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

    // split() citation: https://www.w3schools.com/jsref/jsref_split.asp
    // join() citation: https://www.w3schools.com/jsref/jsref_join.asp
    search_term = search_term.split(" ").join("%20");
		
		getSearchResults(search_term).then( resultsJSON => 
		{
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
				// for each result, add a linked title and summary 
				for ( const page in resultsJSON.pages )
				{				
					let relatedWikipediaPageDiv = document.createElement('p');
				
					let pageTitle = document.createElement('a');
					pageTitle.setAttribute('target', '_blank');
					let title = document.createTextNode(resultsJSON.pages[page].title);
					pageTitle.append(title);
					pageTitle.href = resultsJSON.pages[page].url;
				
					let pageSummary = document.createElement('p');
					let summary = document.createTextNode(resultsJSON.pages[page].extract);
					pageSummary.append(summary);
				
					relatedWikipediaPageDiv.appendChild(pageTitle);
					relatedWikipediaPageDiv.appendChild(pageSummary);
				
					document.getElementById("resultsList").appendChild(relatedWikipediaPageDiv);
				}
			}
		
			// Show the modal
			modal.style.display = "block";
			var span = document.getElementById("closeResultsModalButton");
			span.onclick = function() 
			{
					document.getElementById("search_term").value = "";
					modal.style.display = "none";
			}

			// clear and close modal
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
	let url = "http://flip2.engr.oregonstate.edu:7765/api/?search_term=";
	url =  url + search_term;

	// use fetch to send the request and get the results (Wikipedia pages)
	let response = fetch(url)
		.then(response => response.json())
		.catch(error => alert(error.message));
	
	return response;
}

