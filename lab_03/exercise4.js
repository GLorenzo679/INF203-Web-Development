"use strict";

let slides = [];
let currentSlideIndex = -1;
let isPlaying = false;
let isPaused = false;
let slideTimeout;

function loadSlides() {
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) slides = JSON.parse(this.responseText).slides;
	};

	xhttp.open("GET", "slides.json", true);
	xhttp.send();
}

function playSlideshow() {
	isPlaying = true;
	isPaused = false;
	displaySlide(0);
}

function togglePause() {
	if (!isPlaying) return;

	isPaused = !isPaused;

	if (isPaused) clearTimeout(slideTimeout);
	else displaySlide(currentSlideIndex);
}

function nextSlide() {
	clearTimeout(slideTimeout);
	let nextIndex = Math.min(currentSlideIndex + 1, slides.length - 1);
	displaySlide(nextIndex);
}

function prevSlide() {
	clearTimeout(slideTimeout);
	let prevIndex = Math.max(currentSlideIndex - 1, 0);
	displaySlide(prevIndex);
}

function displaySlide(index) {
	if (index < 0 || index >= slides.length) return;
	currentSlideIndex = index;

	let slidesDiv = document.getElementById("SLSH");
	slidesDiv.innerHTML = "";

	if (slides[index].url) {
		let iframe = document.createElement("iframe");
		iframe.src = slides[index].url;
		iframe.style.width = "100%";
		iframe.style.height = "400px";
		slidesDiv.appendChild(iframe);
	}

	if (index < slides.length - 1 && !isPaused) {
		let nextIndex = index + 1;
		let delay = (slides[nextIndex].time - slides[index].time) * 1000;
		slideTimeout = setTimeout(function () {
			displaySlide(nextIndex);
		}, delay);
	} else isPlaying = false;
}

loadSlides();
