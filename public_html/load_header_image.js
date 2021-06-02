// CS361_Spring2021_400 - Jennifer Zhang
// Index page script to load the background 
// image for the term of the day heading,
// using the the image cropper/transformer 
// microservice

//add form handler
document.addEventListener('DOMContentLoaded', bindGetHeader);

const backupHeaderImage = "./components/header_footer/backup_header_image.jpg";

// bindGetHeader():
// handler for updating the header image
function bindGetHeader() 
{
	getHeaderImage()
	.then(results => 
	{
		console.log(results);
		updateHeaderImage(results.cropped_image_url);
	})
	.catch(error => 
	{
		console.log(error);
		updateHeaderImage(backupHeaderImage);
	});
}	

// getHeaderImage():
// Hits the WWWW endpoint "/cropped_image"
// which calls the image cropper microservice
// with an image url, returns a cropped image
function getHeaderImage()
{
	let endpoint = "http://flip2.engr.oregonstate.edu:7765/cropped_image";

	const params =
	{
			top: 750,
			left: 500,
			width: 1024,
			height: 112,
			url: "http://web.engr.oregonstate.edu/~zhangjen/components/olga-tutunaru-JMATuFkXeHU-unsplash.jpg"	// location in public_html/components/
	}
	
	// add the url query params
	endpoint = endpoint + "?";
	Object.keys(params).forEach( key => {endpoint += "&" + key + "=" + params[key];});

	return fetch(endpoint)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// updateHeaderImage():
// updates the header image with the 
// cropped image version of imageUrl
function updateHeaderImage(imageUrl)
{
	const term_image = document.getElementById('term_image');	

	term_image.src = imageUrl;
	term_image.height = 112;
	term_image.width = 1024;
	term_image.alt = "Original photo by Olga Tutunaru on Unsplash"
	term_image.classList.add("d-block", "align-top", "img-responsive");
}