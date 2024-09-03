"use strict";

function sendMessage() {
	let sentence = document.getElementById("textedit").value;

	if (sentence.trim() !== "") {
		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// reset the text area
				document.getElementById("textedit").value = "";

				// reload the chat log
				loadChatLog();
			}
		};

		xhttp.open("GET", "chat.php?phrase=" + encodeURIComponent(sentence), true);
		xhttp.send();
	}
}

function loadChatLog() {
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) updateChatDisplay(this.responseText);
	};

	xhttp.open("GET", "chatlog.txt", true);
	xhttp.send();
}

function updateChatDisplay(chatLog) {
	let container = document.getElementById("ta");
	container.innerHTML = "";
	let sentences = chatLog.split("\n");

	for (let i = sentences.length - 1; i >= sentences.length - 11 && i >= 0; i--) {
		let sentence = sentences[i].trim();

		if (sentence !== "") {
			let pElement = document.createElement("p");
			pElement.textContent = sentence;
			container.appendChild(pElement);
		}
	}
}

setInterval(loadChatLog, 1000);
