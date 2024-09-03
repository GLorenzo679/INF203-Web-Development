"use strict";

function showText() {
	fetch("../../Data/", { method: "GET" })
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("MAINSHOW").innerHTML = JSON.stringify(data, null, 2);
		})
		.catch((error) => console.error("Error fetching JSON:", error));
}

function showAddForm() {
	document.getElementById("addForm").style.visibility = "visible";
}

function validateAddition() {
	let title = document.getElementById("titleTF").value;
	let value = document.getElementById("valueTF").value;
	let color = document.getElementById("colorTF").value;

	fetch("../../add?title=" + title + "&value=" + value + "&color=" + color, {
		method: "GET",
	})
		.then(() => console.log("Element added successfully"))
		.catch((error) => console.error("Error fetching JSON:", error));

	document.getElementById("addForm").style.visibility = "hidden";
}

function showRemoveForm() {
	document.getElementById("removeForm").style.visibility = "visible";
}

function submitRemoval() {
	let index = document.getElementById("indexTF").value;

	fetch("../../remove?index=" + index, { method: "GET" })
		.then(() => console.log("Element removed successfully"))
		.catch((error) => console.error("Error fetching JSON:", error));

	document.getElementById("removeForm").style.visibility = "hidden";
}

function clearJSON() {
	fetch("../../clear/", { method: "GET" })
		.then((response) => response.text())
		.then((data) => {
			document.getElementById("MAINSHOW").innerHTML = data;
		})
		.catch((error) => console.error("Error fetching JSON:", error));
}

function restoreJSON() {
	fetch("../../restore/", { method: "GET" })
		.then((response) => response.text())
		.then((data) => {
			document.getElementById("MAINSHOW").innerHTML = data;
		})
		.catch((error) => console.error("Error fetching JSON:", error));
}

function showPieChart() {
	fetch("../../Chart")
		.then((response) => response.text())
		.then((svgData) => {
			document.getElementById("MAINSHOW").innerHTML = svgData;
		})
		.catch((error) => console.error("Error fetching Pie Chart:", error));
}

function showLocalPieChart() {
	fetch("../../Data/", { method: "GET" })
		.then((response) => response.json())
		.then((slices) => {
			let value_tot = slices.reduce((acc, slice) => acc + slice.value, 0);
			let svgdata = '<svg id="pieChart" viewBox="-1 -1 2 2" height=500 width=500>';

			let angle_start = 0;
			let angle_end = 0;
			let color = "";
			let title = "";
			let value = 0;
			let slice = null;

			for (let i = 0; i < slices.length; i++) {
				slice = slices[i];
				angle_start = angle_end;
				angle_end = angle_start + (slice.value / value_tot) * 2 * Math.PI;
				color = slice.color;
				title = slice.title;
				value = slice.value;
				svgdata += `<path d="M 0 0  L ${Math.cos(angle_start)} ${Math.sin(angle_start)} A 1 1 0 ${
					value > value_tot / 2 ? 1 : 0
				} 1 ${Math.cos(angle_end)} ${Math.sin(
					angle_end
				)} Z" fill="${color}" stroke="black" stroke-width="0.01" />`;
				svgdata += `<text x="${Math.cos((angle_start + angle_end) / 2)}" y="${Math.sin(
					(angle_start + angle_end) / 2
				)}" text-anchor="middle" dominant-baseline="middle" font-size="0.1">${title} (${value})</text>`;
			}

			svgdata += "</svg>";

			document.getElementById("MAINSHOW").innerHTML = svgdata;
		})
		.catch((error) => console.error("Error fetching Local Pie Chart:", error));
}
