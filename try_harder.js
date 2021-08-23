window.onload=function() {
	//get query from url
	const queryString = window.location.search;
	//console.log(queryString);

	const urlParams = new URLSearchParams(queryString);

	//get query parameter values and put them in input fields
	try {
		const error = urlParams.get('error');
		document.getElementById("error").innerHTML = error;
		switch (error) {
			case "ApiCallIWIAPI":
				errortext = "IWI-API     Der Aufruf der API ist nicht "+
				"fehlerfrei abgelaufen. Bitte versichere dich,"+
				" dass die eingegeben Daten vollständig und "+
				"richtig sind. Auch ein Fehler aufseiten der "+ 
				"Hochschulinfrastuktur ist nicht "+
				"ausgeschlossen. Ein Login-Versuch an "+
				"Hochschuldiensten kann dir hier Auskunft "+
				"geben.";
				break;
			case "ApiCallNEXTCLOUD":
				errortext = "NEXTCLOUD     Der Aufruf der API ist nicht "+
				"fehlerfrei abgelaufen. Bitte versichere dich,"+
				" dass die eingegeben Daten vollständig und "+
				"richtig sind. Auch ein Fehler aufseiten der "+
				"Hochschulinfrastuktur ist nicht "+
				"ausgeschlossen. Ein Login-Versuch an "+
				"Hochschuldiensten kann dir hier Auskunft "+
				"geben.";
				break;
			case "KeinStudent":
				errortext = "Du bist kein Student!";
				break;
			case "NichtVonIWI":
				errortext = "Du bist kein Student unserer "+
				"Fakultät!";
				break;
			case "UsernameInUse":
				errortext = "Das verwendete Kürzel würde bereits registriert."+
				"B"+
				"anderen Namen";
				break;
			case "EmailInUse":
				errortext = "Die Emailadresse wird bereits "+
				"verwendet. Wenn du bereits ein Konto hast, "+
				"kannst du dich "+
				"<a href=\"https://example.com\">hier</a> "+
				"anmelden.";
				break;
			case "AlreadyRegistered":
				errortext = "Mit diesem Hochschulkonto wurde "+
				"bereits ein Nutzerkonto erstellt. Du kannst "+
				"dich <a href=\"https://example.com\">hier</a>"+
				" anmelden.<br><br> Wenn du glaubst, dass "+
				"hier ein Fehler vorliegt oder du dich nicht "+
				"mehr an deinen verwendeten Nutzernamen "+
				"bzw. Email erinnern kannst, kannst du dich " +
				"an einen <a href=\"https://iwi-hka.de"+
				"/scripts/email.php?address=admin\"> "+
				"Admin</a> wenden.";
				break;
			default:
				errortext = "Wir sind uns nicht sicher, ob wir"+
				" dir so helfen können. Bitte wende dich an "+
				"einen <a href=\"https://iwi-hka.de"+
				"/scripts/email.php?address=admin\">Admin</a>.";

		}
		document.getElementById("errortext").innerHTML = errortext;
	}
	catch{}
	//remove query parameters from url after page is loaded
	window.history.replaceState({}, document.title, window.location.pathname);
}
//currently not in use
function setPageLink(pageNumber, nonce) {
	//if (typeof nonce === 'undefined') { nonce = 'default'; }
	pageLinkElement = document.getElementById("pagelink");
	switch (pageNumber) {
		case 0:
			pageLinkElement.href = "/";
			break;
		case 1:
			pageLinkElement.href = "register2?nonce=" + nonce;
			break;
	}
}
