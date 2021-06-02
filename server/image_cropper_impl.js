// CS361_Spring2021_400 - Jennifer Zhang
// Image Cropper Microservice Integration module:
// send an image link and receive a cropped image
// (tried here using the request library)

const request = require('request');
const fs = require('fs');	
const croppedImagePath = "./public/images/cropped_image.jpg";

module.exports.getCroppedImage = getCroppedImage;

// citation help for patching together image saving on the server:
// https://flaviocopes.com/node-download-image/

function getCroppedImage(imageObj, callback)
{
	let imageCropperUrl = "https://img-service-api.herokuapp.com/transform/crop";

	// set the url, left, top, width, height params
	var params = imageObj;

	// create api call
	imageCropperUrl = imageCropperUrl + "?";
	Object.keys(params).forEach( key => {imageCropperUrl += "&" + key + "=" + params[key];});

	request.head(imageCropperUrl, (err, res, body) => {
    request(imageCropperUrl)
      .pipe(fs.createWriteStream(croppedImagePath))
      .on('close', callback)		// on the writable stream 'close' event: https://nodejs.org/api/stream.html#stream_event_close
  });
}