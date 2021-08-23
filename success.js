/*
This script takes the query parameters - attached by the python script of the first registration page - and fills the matching input fields
Author: Marcel Rettig
V0.1 25.01.20 Initial Setup: write registered mail on website
*/

//wait until document is loaded
window.onload=function(){
	//get query from url (everything after ?)
	const queryString = window.location.search;
	//safe as object for easy use
	const urlParams = new URLSearchParams(queryString);

	const email = urlParams.get('email');
	document.getElementById("email").innerText = email;

	//remove query parameters from url after page is loaded
	window.history.replaceState({}, document.title, window.location.pathname);
}
