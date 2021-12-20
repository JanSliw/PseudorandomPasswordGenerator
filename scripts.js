
const errorMessages = [
	"At least one of character sets must be provided"
	, "Password length must be between 1 and 1000. Passwords of length < 10 are not recommended."
];
	
let errors = [];
let charSet = [];
let passwordLength = 0;
let maxTimeoutIndex = 0;
const numbersCharSet = "1234567890";
const upperCaseCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCaseCharSet = "abcdefghijklmnopqrstuvwxyz";
const safeSpecialsCharSet = "!#$%&()*+,-./:;@[\\]^_";
const specialsCharSet = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const numbersWeight = 4;
const upperCaseWeight = 10;
const lowerCaseWeight = 10;
const safeSpecialsWeight = 1;
const specialsWeight = 1;

window.onload = function() {loadFormValuesFromCookies();};

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
		&& !document.getElementById("safe-specials").checked
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
	
	let errorsText = "";
	for (let i = 0; i < errors.length; i++) {
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
	saveFormValuesAsCookies();
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
	const enteredPasswordLength = document.getElementById("password-length").value;
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
	let characters = "";

	if (document.getElementById("numbers").checked) {
		for (let i = 0; i < numbersWeight; i++) {
			characters += numbersCharSet;
		}
	}
	if (document.getElementById("upper-case").checked)  {
		for (let i = 0; i < upperCaseWeight; i++) {
			characters += upperCaseCharSet;
		}
	}
	if (document.getElementById("lower-case").checked) {
		for (let i = 0; i < lowerCaseWeight; i++) {
			characters += lowerCaseCharSet;
		}
	}
	if (document.getElementById("safe-specials").checked) {
		for (let i = 0; i < safeSpecialsWeight; i++) {
			characters += safeSpecialsCharSet;
		}
	} else if (document.getElementById("specials").checked) {
		for (let i = 0; i < specialsWeight; i++) {
			characters += specialsCharSet;
		}
	}

	charSet = [];
	
	for (let i = 0; i<characters.length; i++) {
		charSet.push(characters.charAt(i));
	}
	
	return;
}

function setPassword() {
	document.getElementById("password").value = generateValidPassword();
}

function generateValidPassword() {
	let res = "";
	const cryptO = window.crypto || window.msCrypto;
	const isWindowCryptoAvailable = cryptO !== "undefined";

	while (!isPasswordValid(res)) {
		if (isWindowCryptoAvailable) {
			res = generateWindowCryptoPassword(cryptO);
		} else {
			res = generateMathRandPassword();
		}
	}
	return res;
}

function generateMathRandPassword() {
	let res = "";
	let charIndex = 0;

	for (let i = 0; i < passwordLength; i++) {
		charIndex = Math.floor(Math.random()*charSet.length);
		res += "" + charSet[charIndex];
	}
	return res;
}

function generateWindowCryptoPassword(cryptO) {
	let res = "";
	let charIndex = 0;
	const charIndexes = new Uint32Array(passwordLength);

	cryptO.getRandomValues(charIndexes);
	for (let i = 0; i < passwordLength; i++) {
		charIndex = charIndexes[i]%charSet.length;
		res += "" + charSet[charIndex];
	}
	return res;
}

function isPasswordValid(password) {
	let numbersCount = 0;
	let upperCaseCount = 0;
	let lowerCaseCount = 0;
	let safeSpecialsCount = 0;
	let specialsCount = 0;

	if (password.length === 0) return false;

	for (let i = 0; i < password.length; i++) {
		numbersCount += numbersCharSet.includes(password[i]);
		upperCaseCount += upperCaseCharSet.includes(password[i]);
		lowerCaseCount += lowerCaseCharSet.includes(password[i]);
		safeSpecialsCount += safeSpecialsCharSet.includes(password[i]);
		specialsCount += specialsCharSet.includes(password[i]);
	}

	if (document.getElementById("numbers").checked && numbersCount === 0) return false;
	if (document.getElementById("upper-case").checked && upperCaseCount === 0) return false;
	if (document.getElementById("lower-case").checked && lowerCaseCount === 0) return false;
	if (document.getElementById("safe-specials").checked && safeSpecialsCount === 0) return false;
	if (document.getElementById("specials").checked && specialsCount === 0) return false;

	return true;
}

function occursInText(searchFor, text) {
	return text.includes(searchFor);
}

function copyPasswordToClipBoard() {
	const passwordElement = document.getElementById("password");
	passwordElement.select();
	document.execCommand("copy");
	displayClipboardWindow("Your password has been copied to clipboard");
}

function emptyClipboard() {
	const emptyElement = document.getElementById("empty");
	emptyElement.select();
	document.execCommand("copy");
	displayClipboardWindow("Your clipboard has been cleared");
}

function displayClipboardWindow(innerText) {
	stopAllTimeouts();
	const clipboardMessageElement = document.getElementById("clipboard-message")
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

function saveFormValuesAsCookies() {
	const numbers = document.getElementById("numbers").checked ? 1 : 0;
	const lowerCase = document.getElementById("lower-case").checked ? 1 : 0;
	const upperCase = document.getElementById("upper-case").checked ? 1 : 0;
	const safeSpecials = document.getElementById("safe-specials").checked ? 1 : 0;
	const specials = document.getElementById("specials").checked ? 1 : 0;
	const passwordLength = document.getElementById("password-length").value;

	setCookie("pseudorandomPasswordGenerator_numbers", numbers, 365);
	setCookie("pseudorandomPasswordGenerator_lowerCase", lowerCase, 365);
	setCookie("pseudorandomPasswordGenerator_upperCase", upperCase, 365);
	setCookie("pseudorandomPasswordGenerator_safeSpecials", safeSpecials, 365);
	setCookie("pseudorandomPasswordGenerator_specials", specials, 365);
	setCookie("pseudorandomPasswordGenerator_passwordLength", passwordLength, 365);
}
	
function loadFormValuesFromCookies() {
	let numbers = (getCookie("pseudorandomPasswordGenerator_numbers") == 1);
	let lowerCase = (getCookie("pseudorandomPasswordGenerator_lowerCase") == 1);
	let upperCase = (getCookie("pseudorandomPasswordGenerator_upperCase") == 1);
	let safeSpecials = (getCookie("pseudorandomPasswordGenerator_safeSpecials") == 1);
	let specials = (getCookie("pseudorandomPasswordGenerator_specials") == 1);
	let passwordLength = getCookie("pseudorandomPasswordGenerator_passwordLength");
	const valuesFromCookiesLoaded = passwordLength !== "";

	if (!valuesFromCookiesLoaded) {
		numbers = true;
		lowerCase = true;
		upperCase = true;
		safeSpecials = true;
		passwordLength = 20;
	}
	document.getElementById("numbers").checked = numbers;
	document.getElementById("lower-case").checked = lowerCase;
	document.getElementById("upper-case").checked = upperCase;
	document.getElementById("safe-specials").checked = safeSpecials;
	document.getElementById("specials").checked = specials;
	document.getElementById("password-length").value = passwordLength;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
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
