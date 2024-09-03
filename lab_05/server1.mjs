"use strict";

import { createServer } from "http";
import { readFile, readFileSync, writeFileSync } from "fs";
import { extname } from "path";

function getContentType(filePath) {
	try {
		const ext = extname(filePath).toLowerCase();

		switch (ext) {
			case ".html":
				return "text/html";
			case ".css":
				return "text/css";
			case ".js":
				return "application/javascript";
			case ".mjs":
				return "application/javascript";
			case ".jpeg":
				return "image/jpeg";
			case ".jpg":
				return "image/jpeg";
			case ".png":
				return "image/png";
			case ".txt":
				return "text/plain";
			case ".json":
				return "application/json";
			case ".svg":
				return "image/svg+xml";
			case ".pdf":
				return "application/pdf";
			case ".ico":
				return "image/x-icon";
			default:
				return "application/octet-stream"; // Default MIME type
		}
	} catch (error) {
		console.error("Error getting content type:", error.message);
		return "application/octet-stream"; // Return default MIME type on error
	}
}

function webserver(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	try {
		const { method, url } = req;

		if (url === "/kill" && method === "GET") {
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.end("<!doctype html><html><body>The server will stop now.</body></html>");

			server.close(() => {
				console.log("Server stopped");
				process.exit(0);
			});
		} else if (url.startsWith("/files/") && method === "GET") {
			res.setHeader("Content-Type", "text/html; charset=utf-8");

			const path = url.split("/").slice(2).join("/");

			readFile(path, (err, data) => {
				if (err) {
					console.error("Error reading file:", err.message);
					res.writeHead(404);
					res.end("<!doctype html><html><body>File not found</body></html>");
				} else {
					const contentType = getContentType(path);
					res.writeHead(200, { "Content-Type": contentType });
					res.end(data);
				}
			});
		} else if ((url === "/Data" || url === "/Data/") && method === "GET") {
			res.setHeader("Content-Type", "application/json");

			readFile("storage.json", (err, data) => {
				if (err) {
					console.error("Error reading file:", err.message);
					res.writeHead(404);
					res.end("<!doctype html><html><body>File not found</body></html>");
				} else {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(data);
				}
			});
		} else if (url.startsWith("/add?") && method === "GET") {
			res.setHeader("Content-Type", "application/json");

			const query = url.split("?")[1];
			const params = new URLSearchParams(query);

			const title = params.get("title");
			const value = params.get("value");
			const color = params.get("color");

			readFile("storage.json", (err, data) => {
				if (err) {
					console.error("Error reading file:", err.message);
					res.writeHead(404);
					res.end("<!doctype html><html><body>File not found</body></html>");
				} else {
					const storage = JSON.parse(data);

					storage.push({ title: title, value: Number(value), color: color });

					writeFileSync("storage.json", JSON.stringify(storage));

					res.writeHead(200);
					console.log("Element added successfully");
					res.end();
				}
			});
		} else if (url.startsWith("/remove?index=") && method === "GET") {
			res.setHeader("Content-Type", "application/json");

			const query = url.split("?")[1];
			const params = new URLSearchParams(query);

			const index = params.get("index");

			readFile("storage.json", (err, data) => {
				if (err) {
					console.error("Error reading file:", err.message);
					res.writeHead(404);
					res.end("<!doctype html><html><body>File not found</body></html>");
				} else {
					const storage = JSON.parse(data);
					storage.splice(index, 1);

					writeFileSync("storage.json", JSON.stringify(storage));

					res.writeHead(200);
					console.log("Element removed successfully");
					res.end();
				}
			});
		} else if ((url === "/clear" || url === "/clear/") && method === "GET") {
			res.setHeader("Content-Type", "application/json");

			writeFileSync("storage.json", JSON.stringify([{ title: "empty", color: "red", value: 1 }]));

			res.writeHead(200, { "Content-Type": "text/html" });
			res.end("<!doctype html><html><body>Storage file deleted</body></html>");
		} else if (url.startsWith("/restore") && method === "GET") {
			writeFileSync(
				"storage.json",
				JSON.stringify([
					{
						title: "foo",
						color: "red",
						value: 20,
					},
					{
						title: "bar",
						color: "ivory",
						value: 50,
					},
					{
						title: "baz",
						color: "blue",
						value: 30,
					},
				])
			);

			res.writeHead(200, { "Content-Type": "text/html" });
			res.end("<!doctype html><html><body>Storage file restored</body></html>");
		} else if ((url === "/Chart" || url === "/Chart/") && method === "GET") {
			let slices = JSON.parse(readFileSync("storage.json"));

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

			res.writeHead(200, { "Content-Type": "image/svg+xml" });
			res.write(svgdata);
			res.end();
		} else {
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.end("<!doctype html><html><body>Working!</body></html>");
		}
	} catch (error) {
		console.error("Error processing request:", error.message);
		res.writeHead(500);
		res.end("<!doctype html><html><body>Internal Server Error</body></html>");
	}
}

const port = process.argv[2] || 8000;
const server = createServer(webserver);

server.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`Server is listening on port ${port}`);
});
