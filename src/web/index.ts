import link from "../link";
import express from "express";
const port = process.env.PORT || 3000;
const app = express();
app.use(express.static("static"));
app.set("view engine", "ejs");
// app.get("/api/search", async (req, res) => {
// 	if (!req.query.regex) res.sendStatus(400);
// 	const regex = new RegExp(req.query.regex);
// 	const results = await link.find({title: regex});
// 	res.json({ok: true, results});
// });
app.get("/", async (req, res) => {
    res.render("index", {});
});
app.get("/search", async (req, res) => {
    const oResults = await link.find({ title: new RegExp(req.query.regex) });
	const results = Array.isArray(oResults) ? oResults : [ oResults ];
    res.render("results", { title: "Results", results });
});
app.listen(port, () => console.log(`Now listening on ${port}`));
