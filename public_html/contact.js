// CS361_Spring2021_400 - Jennifer Zhang
// contact me form handling

const contactFormConfigs = 
{
    "url": "http://flip2.engr.oregonstate.edu:7765/contact",
    "method": "post",
    "target": "blank",
}

document.addEventListener("DOMContentLoaded", bindForm); 

function bindForm() 
{
	const form = document.getElementById("contact_form");
	
	// citation for FormData use: https://developer.mozilla.org/en-US/docs/Web/API/FormData
	form.addEventListener("submit", event =>
	{
		event.preventDefault();
		
		fetch(
			form.action, 
			{
				method:'post', 
				body: JSON.stringify(Object.fromEntries(new FormData(form))),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			})
		.then(response => response.text())
		.then(response => alert(response))
		.then(() => form.reset())
		.catch(error => alert("There was an error submitting the form: " + error));
	});
}