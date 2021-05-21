// CS361_Spring2021_400 - Jennifer Zhang
// Image Cropper Microservice Integration module:
// send an image link and receive a cropped image back using the 
// request library (vs node-fetch, as with the image scraper module. 
// this third party library for nodeJS

const request = require('request');
const fs = require('fs');		// for saving the file to a local folder
const croppedImagePath = "./public/images/cropped_image.png";

module.exports.getCroppedImage = getCroppedImage;

// citation help for patching together image saving on the server:
// https://flaviocopes.com/node-download-image/

// getCroppedImage():
// takes in a url for an image and a callback function 
// and returns a cropped image that is cropped:
//    10 pixels from the top
//    10 pixels from the left
//    100 pixels wide from the cropped upper left corner
//		100 pixels wide from the cropped upper left corner
function getCroppedImage(originalImageUrl, callback)
{
	// base url
	let imageCropperUrl = "https://img-service-api.herokuapp.com/transform/crop";

	var params = 
	{
		url: originalImageUrl,
		left: "05",
		top: "05",
		width: "50",
		height: "50"
	};

	// create api call
	imageCropperUrl = imageCropperUrl + "?";
	Object.keys(params).forEach( key => {imageCropperUrl += "&" + key + "=" + params[key];});

	
	request.head(imageCropperUrl, (err, res, body) => {
    request(imageCropperUrl)
      .pipe(fs.createWriteStream(croppedImagePath))
      .on('close', callback)		// on the writable stream 'close' event: https://nodejs.org/api/stream.html#stream_event_close
  });
}