import fetch, { FetchError } from "node-fetch";
import cheerio from "cheerio";
import URL from "url";
// import fs from "fs"
// import { inspect } from "util";
import LinkModel from "./link";

export default class Crawler {
    private queue: string[];
    private visitedCache: Set<string>;
    constructor(startingURLs: string[]) {
        this.queue = startingURLs;
        this.visitedCache = new Set();
        this.eatDatQueue();
    }
    async eatDatQueue() {
        while (this.queue.length !== 0) {
            const url = this.queue.pop();
            if (!url) continue;
            if (this.visitedCache.has(url)) continue;
            const moreUrls = await this.crawl(url);
            this.visitedCache.add(url);
            this.queue = this.queue.concat(moreUrls || []);
            console.log("Queue length now " + this.queue.length);
        }
    }

    async crawl(url: string) {
        try {
            const res = await fetch(url);
            const $ = cheerio.load(await res.text());
            // fs.writeFileSync("htmltest/" + Buffer.from(url).toString('base64') + ".html", ($.html()));
            const linksInitalWeirdTypes: string[] = $("a[href]")
                .get()
                .filter((ele) => ele.attribs && ele.attribs.href)
                .map((ele) => ele.attribs.href);
            const links = linksInitalWeirdTypes
                .filter((link) => !link.startsWith("#"))
                .filter((link) => !link.startsWith("?"))
                .map((link) => {
                    if (link.startsWith("/")) {
                        // Handle relative links
                        const linkAsURL = new URL.URL(url);
                        if (link.startsWith("//")) {
                            // Another special case! Same-protocol URLs
                            return link.replace(
                                "//",
                                linkAsURL.protocol + "//"
                            );
                        } else {
                            linkAsURL.pathname = link.substring(1);
                            return linkAsURL.toString();
                        }
                    } else return link;
                });
            const metas: Map<string, string> = new Map();
            for (let m of $("meta").get()) {
                if (m.attribs.name && m.attribs.content)
                    metas.set(m.attribs.name.split(".").join(""), m.attribs.content);
            }
            console.log(
                await LinkModel.create([
                    { link: url, meta: metas, title: $("title").text() }
                ])
            );
            // console.log(links);
            return links;
        } catch (error) {
			console.error(error);
			console.error(`I will continue. url=${url}`);
		}
    }
}
