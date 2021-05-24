// CS361_Spring2021_400 - Jennifer Zhang
// Index page script to load the background 
// image for the term of the day heading
// Part of the implementation for the image
// cropper/transformer microservice

//add form handler
document.addEventListener('DOMContentLoaded', bindGetHeader);

// header image backup url
const backupHeaderImage = "./components/header_footer/backup_header_image.jpg";

// bindGetHeader():
// Handler for updating the header image
// Called only when visiting the home page
// Visually, nothing looks different, but
// the header is being updated nonetheless
// as evidenced by the console log after
// the function call
function bindGetHeader() 
{
	// get updated header
	getHeaderImage()
	.then(results => 
	{
		console.log(results);
		updateHeaderImage(results.cropped_image_url);
	})
	.catch(error => 
	{
		console.log(error);
		// update with backup
		updateHeaderImage(backupHeaderImage);
	});
}	

// getHeaderImage():
// Hits the WWWW server endpoint /cropped_image
// which calls the image cropper microservice, 
// sending in the url of the original image, the
// dimensions to which to crop the image, and the
// callback function to run after cropping the 
// image. The WWWW /cropped_image endpoint sends
// back the url/location of the modified image, as 
// well as the unix timestamp of when the modified
// image was created
function getHeaderImage()
{
	//build the endpoint call
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

	// use fetch to send the request and get the results (Wikipedia pages)
	return fetch(endpoint)
		.then(response => response.json())
		.catch(error => console.log(error.message));
}

// updateHeaderImage():
// places the img src for the term of the 
// day, as specified by the imageUrl arg.
// the backup image is black and white and 
// the sepia toned image is the result of 
// the call to the image cropper/transformer
// microservice
function updateHeaderImage(imageUrl)
{
	// create image node
	const term_image = document.getElementById('term_image');	

	// set attributes
	term_image.src = imageUrl;
	console.log("term_image.src: " + term_image.src);
	term_image.height = 112;
	term_image.width = 1024;
	term_image.alt = "Original photo by Olga Tutunaru on Unsplash"
	term_image.classList.add("d-block", "align-top", "img-responsive");
}