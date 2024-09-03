"use strict";

import express from "express";
import morgan from "morgan";
import { readFileSync, writeFileSync } from "fs";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

let db = JSON.parse(readFileSync("./db.json"));

// middlewares

try {
	// list of routes
	app.get("/", (req, res) => {
		res.set("Content-Type", "text/plain");
		res.status(200).send("Hello World!");
	});

	app.get("/exit", (req, res) => {
		res.set("Content-Type", "text/plain");
		res.status(200).send("The server will stop now.");

		process.exit(0).catch((err) => console.error(err));
	});

	app.get("/restart", (req, res) => {
		db = JSON.parse(readFileSync("./db.json"));

		res.set("Content-Type", "text/plain");
		res.status(200).send("db.json reloaded");
	});

	app.get("/papercount", (req, res) => {
		res.set("Content-Type", "text/plain");
		res.status(200).send(db.length.toString());
	});

	app.get("/byauthor/:author", (req, res) => {
		const author = req.params.author;

		const count = db.filter((paper) =>
			paper.authors.some((a) => a.toLowerCase().includes(author.toLowerCase()))
		).length;

		res.set("Content-Type", "text/plain");
		res.status(200).send(count.toString());
	});

	app.get("/papersdesc/:author", (req, res) => {
		const author = req.params.author;

		const papers = db.filter((paper) => {
			return paper.authors.some((a) => a.toLowerCase().includes(author.toLowerCase()));
		});

		res.set("Content-Type", "application/json");
		res.status(200).send(JSON.stringify(papers));
	});

	app.get("/titlelist/:author", (req, res) => {
		const author = req.params.author;

		const papers = db.filter((paper) => {
			return paper.authors.some((a) => a.toLowerCase().includes(author.toLowerCase()));
		});

		const titles = papers.map((paper) => paper.title);

		res.set("Content-Type", "application/json");
		res.status(200).send(JSON.stringify(titles));
	});

	app.get("/reference/:key", (req, res) => {
		const key = req.params.key;

		const papers = db.filter((paper) => paper.key == key);

		res.set("Content-Type", "application/json");
		res.status(200).send(JSON.stringify(papers[0]));
	});

	app.delete("/reference/:key", (req, res) => {
		const key = req.params.key;

		db = db.filter((paper) => paper.key != key);

		res.set("Content-Type", "text/plain");
		res.status(200).send("Paper deleted");
	});

	app.post("/reference", (req, res) => {
		const newPublication = req.body;
		newPublication.key = "imaginary";

		db.push(newPublication);

		res.set("Content-Type", "text/plain");
		res.status(200).send("Publication added");
	});

	app.put("/reference/:key", (req, res) => {
		const key = req.params.key;
		const updatedPublication = req.body;

		db.forEach((paper) => {
			if (paper.key === key) {
				Object.assign(paper, updatedPublication);
			}
		});

		res.set("Content-Type", "text/plain");
		res.status(200).send("Publication updated");
	});

	// server start
	const port = process.argv[2] || 8000;
	app.listen(port, () => console.log(`Server listening on port ${port}!`));
} catch (err) {
	console.error(err);
	process.exit(1);
}
