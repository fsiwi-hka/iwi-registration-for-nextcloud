/*
This script lets the user get his encrypted password from iwi rest api an fills it in the password field
Author: Marcel Rettig
V0.1: 20.12.20 basic form and basic request
V0.2: 21.12.20 add popup-window and error handling
V0.3: 22.12.20 extend error handling, better error messages
V0.4: 11.01.21 extend ajax call for posible future use
V0.5: 20.01.21 more error handling
V0.6: 22.01.21 remove qQuery dependency (exept request) and add code commentary
*/

//wait until document is loaded
window.onload=function() {
	//get object references
	var startbutton = document.getElementById("getPW"),
	dialog = document.getElementById('dialog'),
	dialogSubmit = document.getElementById("Anmeldung"),
	dialogCancel = document.getElementById("Abbruch");

	//add eventlisteners so buttons work
	startbutton.addEventListener('click', showWindow);
	dialogSubmit.addEventListener('click', getEncryptedPassword);
	dialogCancel.addEventListener('click', closeWindow);

}
//used in encrypted password request - error handling; declared here to keep data beyond requests
var errorcount = 0;
var errormessage401 = "";

//take username and password and get encrypted password from api
function getEncryptedPassword() {
	closeWindow();
	//get username and password from form
	const password = document.getElementById("password").value;
	const username = document.getElementById("username").value;
	//build base64 string which is used to authenticate at the iwi rest api
	const base64String = btoa(username + ":" + password);
	//build rest request
	var settings = {
		"url": "https://www.iwi.hs-karlsruhe.de/iwii/REST/credential/encryptedpassword",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"Authorization": "Basic " + base64String
		},
	};
	//execute rest request
	$.ajax(settings)
	//request successfull
	.done(function (data, textStatus, jqXhrObject) {
		//alert(jqXhrObject.status);
		//insert recieved encrypted password into password field of the main login form
		document.getElementById("pw").value = data;
		//copy username from pop-up window into main form (so the user doesn't need to, if it was empty before)
		document.getElementById("user").value = username;
		//focus password field in main login form (so enter key works)
		document.getElementById("pw").focus();
		//alert(data);
	})
	//request not successfull
	.fail(function (jqXhrObject, textStatus, errorThrown) {
		//error handling for different error codes
		if(jqXhrObject.status == 401) {
			if(errorcount == 0) {
				errormessage401 = "[401] Bitte überprüfe deine eingegebenen Login-Daten.";
			} else if(errorcount == 2) {
				errormessage401 += "\n\nDieser Fehler kann auch vorkommen, wenn es Login-Problem bei der Hochschule gibt, "
			+ "versuche es zunächst dort einmal und dann in ein paar Minuten erneut bei uns.";
			}
			if(window.confirm(errormessage401)) {
				showWindow();
			} else {
				document.getElementById("pw").value = null;
			}
			errorcount += 1;
		} else if(jqXhrObject.status == 500) {
			alert("[500] Die IWI REST API scheint gerade nicht erreichbar zu sein, versuche es später erneut");
		} else if(jqXhrObject.status == 0) {
			alert("[0] Da ist was schief gelaufen. Hast du vielleicht einen Script-Blocker wie uMatrix? "
			+ "Dort musst du XHRs von www.iwi.hs-kalrsruhe.de erlauben.")
		} else {
			alert("[" + jqXhrObject.status + "] Fehler. Wir wissen nicht genau was los sein könnte. "
			+ "Probiere es in einigen Minuten erneut. Falls der Fehler weiterhin besteht, kannst du dich "
			+ "gerne mit dem Fehlercode an admin[aet]unsere.Domain wenden.");
		}
	})
	//always executed (maybe for future use)
	//type of object varies depending on  the outcome of the request
		      //success or    error		  //success   or    error
	.always(function (dataORjqXhrObject, textStatus, jqXhrObjectORerrorThrown) {
		console.log(dataORjqXhrObject);
		console.log(textStatus);
		console.log(jqXhrObjectORerrorThrown);
	});
}
//show pop-up window an copy potential values from main login form
function showWindow() {
	dialog.showModal();
	document.getElementById("username").value = document.getElementById("user").value;
	document.getElementById("password").value = document.getElementById("pw").value;
}

function closeWindow() {
	dialog.close();
}
