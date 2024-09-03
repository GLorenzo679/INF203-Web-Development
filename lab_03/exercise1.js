"use strict";

function loadDoc() {
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("ta").value = this.responseText;
		}
	};

	xhttp.open("GET", "text.txt", true);
	xhttp.send();
}

function getRandomColor() {
	let letters = "0123456789ABCDEF";
	let color = "#";

	for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

	return color;
}

function loadDoc2() {
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let text = this.responseText;
			let lines = text.split("\n");

			let div = document.getElementById("ta2");

			for (let i = 0; i < lines.length; i++) {
				let p = document.createElement("p");
				p.setAttribute("style", "color: " + getRandomColor());
				p.innerHTML = lines[i];
				div.appendChild(p);
			}
		}
	};

	xhttp.open("GET", "text.txt", true);
	xhttp.send();
}
