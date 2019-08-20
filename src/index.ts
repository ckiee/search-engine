import Crawler from "./crawler";
import link from "./link";

const crawler = new Crawler(["https://ronthecookie.me"]);

link.find({title: /ron/})