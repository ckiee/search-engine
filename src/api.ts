import link from "./link";
import express from "express";
const port = process.env.PORT || 3000;
const app = express();

app.get("/search", async (req, res) => {
	if (!req.query.regex) res.sendStatus(400);
	const regex = new RegExp(req.query.regex);
	const results = await link.find({title: regex});
	res.json({ok: true, results});
});

app.listen(port, () => console.log(`Now listening on ${port}`))