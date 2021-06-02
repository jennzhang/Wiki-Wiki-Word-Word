// CS361_Spring2021_400 - Jennifer Zhang
// Wikipedia scraper module - get wiki links and blurbs related to a search term

const fetch = require('node-fetch'); // fetch() is browser implemented, so using a third party library for use of fetch with nodeJS

module.exports.getWikiSearchResults = getWikiSearchResults;

// functions ---------------------------------------------------------

// getWikiSearchResults():
// takes in a search term and returns a list of 
// 0-10 related Wikipedia articles
function getWikiSearchResults(searchTerm)
{
	// Wikipedia has a recommendation for their url builder. Used here, citation: https://www.mediawiki.org/wiki/API:Pageprops
	
	var wikiAPISearchUrl = "https://en.wikipedia.org/w/api.php";
	let term = searchTerm.split(" ").join("%20"); 
	
	// 15 page retrieval limit, then trim as needed
	var params = 
	{
		action: "query",
		format: "json",
		generator: "search",
		prop: "extracts|pageprops",
		gsrlimit: "15",					// generator search results page limit. 
		exsentences: "3",				// extract max sentences
		exintro: "1",					// boolean: if the parameter is specified, regardless of value, it is considered true
		explaintext: "1",				// also a boolean
		ppprop: "disambiguation", 		// speficies if a page is a disambiguation page
		gsrsearch: term						
	};

	// for unauthenticated CORS request, set the origin parameter t0 "*"
	// citation: https://www.mediawiki.org/wiki/API:Cross-site_requests
	wikiAPISearchUrl = wikiAPISearchUrl + "?origin=*";
	Object.keys(params).forEach(key => {wikiAPISearchUrl += "&" + key + "=" + params[key];});

	let wikipediaResponse = fetch(wikiAPISearchUrl)
													.then(wikiResponse => wikiResponse.json())
													.then(wikiResponseJSON => {
														
														let response = {};
												
														if (wikiResponseJSON.query) 	// there are search results
														{
															response.pages = formatPages(wikiResponseJSON.query.pages);
															response.numResults = Object.keys(response.pages).length;	
														}
														else	// there are no search results
														{
															response.numResults = 0;
															response.pages = {};
														}
														return response;
													})
													.catch(error => {console.log(error);
													});
	return wikipediaResponse;
};

function removePagesWithoutExtracts(pagesObj)
{
	Object.keys(pagesObj).forEach(page => 
	{
		if (pagesObj[page].pageprops ||
			pagesObj[page].extract.length == 0) 
			{
				// delete disambiguation pages and pages with
				// empty extracts from the response.
				delete pagesObj[page];
			}
	});
	
	return pagesObj;
}

function reorderIndexes(pagesObj)
{
	let newIdxPages = [];
	
	Object.keys(pagesObj).forEach(page => 
	{
		newIdxPages.push(pagesObj[page]);
	});

	// citation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	newIdxPages.sort((a, b) => a.index - b.index);
	
	// only keep the first ten pages. Note: removePagesWithoutExtracts() should have been called first
	newIdxPages = newIdxPages.slice(0,10)
	
	pagesObj = {};
	for (idx in newIdxPages) pagesObj[Number(idx) + 1] = newIdxPages[idx]
	
	return pagesObj;
}

function trimAttributes(pagesObj)
{
	Object.keys(pagesObj).forEach(page => 
	{
		delete pagesObj[page].index;
		delete pagesObj[page].ns;
	
		pagesObj[page].url = "https://en.wikipedia.org/wiki/" 
													+ pagesObj[page]
														.title
														.split(" ")
														.join("_");
	});
	return pagesObj;
}

function formatPages(pagesObj)
{
	return pages = trimAttributes(
					reorderIndexes(
							removePagesWithoutExtracts(pagesObj)));
}