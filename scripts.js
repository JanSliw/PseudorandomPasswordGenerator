
var errorMessages = [
	"At least one of character sets must be provided"
	, "Password length must be between 1 and 1000. Passwords of length < 10 are not recommended."
];
	
var errors = [];
var charSet = [];
var passwordLength = 0;
var maxTimeoutIndex = 0;

window.onload = function() {loadFormValues();};

function generateClicked() {
	event.preventDefault();
	generatePassword();
}

function copyToClipboardClicked() {
	event.preventDefault();
	copyPasswordToClipBoard();
}

function clearClipboardClicked() {
	event.preventDefault();
	emptyClipboard();
}

function checkIfAllUnchecked() {
	if (!document.getElementById("numbers").checked
		&& !document.getElementById("upper-case").checked
		&& !document.getElementById("lower-case").checked
		&& !document.getElementById("specials").checked){
			addErrorText(errorMessages[0]);
	} else {
		removeErrorText(errorMessages[0]);
	}
}

function addErrorText(text)	{
	if (!errors.includes(text)) errors.push(text);
	setErrors();
}

function removeErrorText(text) {
	errors = errors.filter(function (value) {
		return value !== text;
	});
	setErrors();
}

function setErrors() {
	
	var errorsText = "";
	for (var i = 0; i < errors.length; i++) {
		errorsText += "<br>" + errors[i];
	}
	if (errorsText.substring(0, 4) === "<br>") {
		errorsText = errorsText.substring(4);
	}
	document.getElementById("errors").innerHTML = errorsText;
}



function generatePassword() {
	
	// copy to clipboard button
	// clear clipboard button
	event.preventDefault();
	getData();	
	if (!validateForm()) return;
	setPassword();
	saveFormValues();
	copyPasswordToClipBoard();
	// clear clipboard - blocked by the browser
	// maxTimeoutIndex = setTimeout(emptyClipboardTimeOut(), 10000);
}


function stopAllTimeouts() {
	if (maxTimeoutIndex == 0) return;
	while (maxTimeoutIndex--) {
		window.clearTimeout(maxTimeoutIndex+1); 
	}
}

function getData() {
	getCharSet();
	getPasswordLength();
}

function getPasswordLength() {
	var enteredPasswordLength = document.getElementById("password-length").value;
	if (enteredPasswordLength.length == 0) {
		addErrorText(errorMessages[1]);
		passwordLength = -1;
		return;
	} else {
		removeErrorText(errorMessages[1]);
	}
	passwordLength = 0;
	if (typeof parseInt(enteredPasswordLength, 10) != 'number'){
		passwordLength = -1;
		return;
	}
	passwordLength = parseInt(enteredPasswordLength, 10);	
	if (passwordLength < 10 || passwordLength > 1000) {
		addErrorText(errorMessages[1]);
	} else {
		removeErrorText(errorMessages[1]);
	}
}

function validateForm() {
	if (charSet.length == 0) {
		addErrorText(errorMessages[0]);
		return false;
	} else {
		removeErrorText(errorMessages[0]);
	}
	if (passwordLength == -1) {
		return false;
	}
	return true;
}

function getCharSet() {
	
	var numbers = "1234567890";
	var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lowerCase = "abcdefghijklmnopqrstuvwxyz";
	var specials = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
	
	var characters = "";
	
	if (document.getElementById("numbers").checked) characters += numbers;
	if (document.getElementById("upper-case").checked) characters += upperCase;
	if (document.getElementById("lower-case").checked) characters += lowerCase;
	if (document.getElementById("specials").checked) characters += specials;
	
	charSet = [];
	
	for (var i = 0; i<characters.length; i++) {
		charSet.push(characters.charAt(i));
	}
	
	return;
}

function setPassword() {
	var res = "";
	var charIndex = 0;
	var cryptO = window.crypto || window.msCrypto;
	
	if (cryptO === "undefined") {
		for (var i = 0; i < passwordLength; i++) {
			charIndex = Math.floor(Math.random()*charset.length);
			res += "" + charSet[charIndex];
		}
	} else {
		var charIndexes = new Uint32Array(passwordLength);
		cryptO.getRandomValues(charIndexes);
		for (var i = 0; i < passwordLength; i++) {
			charIndex = charIndexes[i]%charSet.length;
			res += "" + charSet[charIndex];
		}
	}
	document.getElementById("password").value = res;
	
	return;
}

function copyPasswordToClipBoard() {
	var passwordElement = document.getElementById("password");
	passwordElement.select();
	document.execCommand("copy");
	displayClipboardWindow("Your password has been copied to clipboard");
}

function emptyClipboard() {
	var emptyElement = document.getElementById("empty");
	emptyElement.select();
	document.execCommand("copy");
	displayClipboardWindow("Your clipboard has been cleared");
}

function displayClipboardWindow(innerText) {
	stopAllTimeouts();
	var clipboardMessageElement = document.getElementById("clipboard-message")
	hideClipboardWindow();
	maxTimeoutIndex = setTimeout(function() {
									clipboardMessageElement.className = "show";
								}, 500);
	maxTimeoutIndex = setTimeout(function() {
									clipboardMessageElement.innerText = innerText;
								}, 750);
	maxTimeoutIndex = setTimeout(function() {
									clipboardMessageElement.className = "slide-down";
								}, 2500);
	maxTimeoutIndex = setTimeout(function() {
									clipboardMessageElement.innerText = "";
								}, 3100);
	maxTimeoutIndex = setTimeout(hideClipboardWindow
								, 3500);
}

function showClipboardWindow() {
	clipboardMessageElement.className = "show";
}

function slideDownClipboardWindow() {
	clipboardMessageElement.className = "slide-down";
}

function changeClipboardWindowInnerText(innerText) {
	clipboardMessageElement.innerText = innerText;
}

function hideClipboardWindow() {
	document.getElementById("clipboard-message").innerText = "";
	document.getElementById("clipboard-message").className = "hide";
	
}

function saveFormValues() {
	var numbers = document.getElementById("numbers").checked ? 1 : 0;
	var lowerCase = document.getElementById("lower-case").checked ? 1 : 0;
	var upperCase = document.getElementById("upper-case").checked ? 1 : 0;
	var specials = document.getElementById("specials").checked ? 1 : 0;
	var passwordLength = document.getElementById("password-length").value;

	setCookie("pseudorandomPasswordGenerator_numbers", numbers, 365);
	setCookie("pseudorandomPasswordGenerator_lowerCase", lowerCase, 365);
	setCookie("pseudorandomPasswordGenerator_upperCase", upperCase, 365);
	setCookie("pseudorandomPasswordGenerator_specials", specials, 365);
	setCookie("pseudorandomPasswordGenerator_passwordLength", passwordLength, 365);
}
	
function loadFormValues() { 
	var numbers = (getCookie("pseudorandomPasswordGenerator_numbers") == 1);
	var lowerCase = (getCookie("pseudorandomPasswordGenerator_lowerCase") == 1);
	var upperCase = (getCookie("pseudorandomPasswordGenerator_upperCase") == 1);
	var specials = (getCookie("pseudorandomPasswordGenerator_specials") == 1);
	var passwordLength = getCookie("pseudorandomPasswordGenerator_passwordLength");
	
	document.getElementById("numbers").checked = numbers;
	document.getElementById("lower-case").checked = lowerCase;
	document.getElementById("upper-case").checked = upperCase;
	document.getElementById("specials").checked = specials;
	document.getElementById("password-length").value = passwordLength;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setToLocalStorage(name, value) {
	localStorage.setItem(name, value);
	
}

function getFromLocalStorage(name) {
	return localStorage.getItem(name);
}
