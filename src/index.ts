import Crawler from "./crawler";
import link from "./link";

const crawler = new Crawler(["https://github.com/jellz?tab=repositories"]);

// link.find({title: /ron/})