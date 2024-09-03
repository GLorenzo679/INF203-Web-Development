"use strict";

function startSlideshow() {
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let slidesData = JSON.parse(this.responseText);
			renderSlides(slidesData.slides);
		}
	};

	xhttp.open("GET", "slides.json", true);
	xhttp.send();
}

function renderSlides(slidesData) {
	slidesData.forEach(function (slide) {
		setTimeout(function () {
			let slidesContainer = document.getElementById("SLSH");
			let iframe = document.createElement("iframe");

			iframe.src = slide.url;
			iframe.width = "100%";
			iframe.height = "500px";

			slidesContainer.innerHTML = "";
			slidesContainer.appendChild(iframe);
		}, slide.time * 1000);
	});
}
