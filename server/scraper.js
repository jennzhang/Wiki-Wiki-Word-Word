// CS361_Spring2021_400 - Jennifer Zhang
// Wikipedia scraper module - get wiki links and blurbs related to a search term
const fetch = require('node-fetch'); // fetch() is browser implemented, so using a third party library for its use with nodeJS

module.exports.getWikiSearchResults = getWikiSearchResults;

// functions ---------------------------------------------------------

// getWikiSearchResults():
// takes in a search term and returns a list of 
// 0-10 related Wikipedia articles, with a rank 
// index indicating the relevancy (1 is the highest
// relevancy and 10 is the lowest). For each article,
// a pageid, title, short extract no longer than 
// three sentences, and a url are returned.
function getWikiSearchResults(searchTerm)
{
	// Wikipedia has a recommendation for their url builder. Used here, citation: https://www.mediawiki.org/wiki/API:Pageprops

	// base url
	var wikiAPISearchUrl = "https://en.wikipedia.org/w/api.php";
	
	// format the search term. change any spaces to "%20"
	// split() citation: https://www.w3schools.com/jsref/jsref_split.asp
	// join() citation: https://www.w3schools.com/jsref/jsref_join.asp
	let term = searchTerm.split(" ").join("%20"); 
	
	// Note for page retrieval limit: allow up to 15 pagesto cover any disambiguation pages. Remove disambiguation pages in formatPages() via removeDisambiguationPages();
	var params = 
	{
		action: "query",
		format: "json",
		generator: "search",
		prop: "extracts|pageprops",
		gsrlimit: "15",					// generator search results page limit. 
		exsentences: "3",				// extract max sentences
		exintro: "1",					// boolean: if the parameter is specified, regardless of value, it is considered true
		explaintext: "1",				// also a boolean parameter
		ppprop: "disambiguation", 		// speficies if a page is a disambiguation page
		gsrsearch: term					// search term					
	};

	// for unauthenticated CORS request, set the origin parameter t0 "*"
	// citation: https://www.mediawiki.org/wiki/API:Cross-site_requests
	wikiAPISearchUrl = wikiAPISearchUrl + "?origin=*";
	Object.keys(params).forEach( key => {wikiAPISearchUrl += "&" + key + "=" + params[key];});

	// note: using the fetch as recommended by the Wikipedia API instead of an XMLHttpRequest object for brevity. MDN citation, if needed: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	let wikipediaResponse = fetch(wikiAPISearchUrl)
		.then( wikiResponse => {return wikiResponse.json();})
		.then( wikiResponseJSON => {
			
			let response = {};
	
			if (wikiResponseJSON.query) 	// there are search results
			{
				response.pages = formatPages(wikiResponseJSON.query.pages);
				response.numResponses = Object.keys(response.pages).length;	
			}
			else	// there are no search results
			{
				response.numResponses = 0;
				response.pages = {};
			}
			return response;
		})
		.catch( error => {console.log(error);});
	
	return wikipediaResponse;
};

// removeDisambiguationPages() :
// is a helper function that removes any Wikipedia
// search results that are disambiguation pages, as
// these pages do not have any direct information 
// nor do they have meaningful extracts. The pages
// indicated in disambiguation pages should already 
// be included in the reset of the Wikipedia search
// results set
function removeDisambiguationPages(pagesObj)
{
	Object.keys(pagesObj).forEach( page => 
	{
		if (pagesObj[page].pageprops) 
			{
				// delete the disambiguation page from the response. 
				delete pagesObj[page];
			}
	});
	
	return pagesObj;
}

// reorderIndexes():
// is a helper function which is called after 
// removeDisambiguationPages(); it reorders
// the indexes of the Wikipedia search results 
// so that they are contiguous and limits the
// max search results to 10, if there are more
// than 10 present.
function reorderIndexes(pagesObj)
{
	// use an array to sort the indexes
	let newIdxPages = [];
	
	// add each page to the reorder array, newIdxPages	
	Object.keys(pagesObj).forEach( page => 
	{
		newIdxPages.push(pagesObj[page]);
	});

	// sort the array. Using MDN's approach for sorting numbers in javascript,
	// citation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	newIdxPages.sort((a, b) => a.index - b.index);
	
	// only keep the first ten pages. Note: removeDisambiguationPages() should have been called first
	newIdxPages = newIdxPages.slice(0,10)
	
	// empty pagesObj and then rebuild
	pagesObj = {};
	for (idx in newIdxPages) pagesObj[Number(idx) + 1] = newIdxPages[idx]	// citation for Number(): https://www.w3schools.com/jsref/jsref_number.asp
	
	return pagesObj;
}


// trimAttributes():
// is a helper function that is called after
// reorderIndexes(); it trims the Wikipedia 
// results set so that only the desired
// original attributes are kept (pageid, 
// title, extract), and add's the Wikipedia 
// page url as a new attribute for each
// Wikipedia page.
function trimAttributes(pagesObj)
{
	// remove keys: index, ns
	// add url using the title (not using the pageid)	
	Object.keys(pagesObj).forEach( page => 
	{
		delete pagesObj[page].index;
		delete pagesObj[page].ns;
		
		// add the url to the response: format page titles so that spaces become underscores
		// split() citation: https://www.w3schools.com/jsref/jsref_split.asp
		// join() citation: https://www.w3schools.com/jsref/jsref_join.asp
		pagesObj[page].url = "https://en.wikipedia.org/wiki/" + pagesObj[page].title.split(" ").join("_");
	});
	
	// console.log(pagesObj);
	
	return pagesObj;
}

// formatPages():
// formats the Wiki Wiki Word Word Response 
// JSON in preparation to send to the caller 
// of the Wiki Wiki Word Word API endpoint.
// The function is only called if Wikipedia
// returns search results for the search term.
function formatPages(pagesObj)
{
	// format the Wiki Wiki Word Word Response JSON
	let pages = trimAttributes(
					reorderIndexes(
							removeDisambiguationPages(pagesObj)));
	
	return pages;
}