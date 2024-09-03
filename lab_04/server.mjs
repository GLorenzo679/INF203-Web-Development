"use strict";

import { createServer } from "http";
import { readFile } from "fs";
import { extname } from "path";
import { unescape } from "querystring";

const visitedUsers = new Set();

function sanitizeUserInput(user) {
	return user.replace(/</g, "_").replace(/>/g, "_");
}

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
			default:
				return "application/octet-stream"; // Default MIME type
		}
	} catch (error) {
		console.error("Error getting content type:", error.message);
		return "application/octet-stream"; // Return default MIME type on error
	}
}

function webserver(request, response) {
	try {
		const { method, url } = request;

		if (url === "/end" && method === "GET") {
			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end("<!doctype html><html><body>The server will stop now.</body></html>");

			server.close(() => {
				console.log("Server stopped");
				process.exit(0);
			});
		} else if (url.startsWith("/files/") && method === "GET") {
			response.setHeader("Content-Type", "text/html; charset=utf-8");

			const path = url.split("/").slice(2).join("/");

			readFile(path, (err, data) => {
				if (err) {
					console.error("Error reading file:", err.message);
					response.writeHead(404);
					response.end("<!doctype html><html><body>File not found</body></html>");
				} else {
					const contentType = getContentType(path);
					response.writeHead(200, { "Content-Type": contentType });
					response.end(data);
				}
			});
		} else if (url.startsWith("/hi?visiteur=") && method === "GET") {
			const visitorParam = unescape(url.split("visiteur=")[1]);
			const greetingHtml = `<html><body>hi ${visitorParam}</body></html>`;

			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end(greetingHtml);
		} else if (url.startsWith("/salut?user=") && method === "GET") {
			const user = unescape(url.split("user=")[1] || "");

			const sanitizedUser = sanitizeUserInput(user);

			const usersList = Array.from(visitedUsers).join(", ");
			const greetingHtml = `<html><body>salut ${sanitizedUser}, the following users have already visited this page: ${usersList}</body></html>`;

			visitedUsers.add(sanitizedUser);

			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end(greetingHtml);
		} else if (url.startsWith("/clear") && method === "GET") {
			visitedUsers.clear();

			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end("<!doctype html><html><body>Visited users list cleared!</body></html>");
		} else {
			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.end("<!doctype html><html><body>Working!</body></html>");
		}
	} catch (error) {
		console.error("Error processing request:", error.message);
		response.writeHead(500);
		response.end("<!doctype html><html><body>Internal Server Error</body></html>");
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
