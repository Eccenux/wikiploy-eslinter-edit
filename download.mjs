import fs from "node:fs/promises";
import path from "node:path";
import { buildOutputPath, extractWikiTitle, loadSource } from "./inc/load-helper.mjs";

const outputPath = './src';

/*
Downloading a file:
node download.mjs <url>

E.g.:
node download.mjs https://commons.wikimedia.org/w/index.php?title=MediaWiki%3APermissionsRequestsDesk.js

*/

async function main() {
	let url;
	url = process.argv[2];
	// url = 'https://commons.wikimedia.org/w/index.php?title=MediaWiki%3APermissionsRequestsDesk.js&diff=1078848943&oldid=1078848781';

	if (!url) {
		console.error("Usage: node download.mjs <article-url>");
		process.exit(1);
	}

	// parse URL
	const parsedUrl = new URL(url);
	if (!parsedUrl.hostname.endsWith('.org') || parsedUrl.pathname.search(/\/(wiki|w)\//)!==0) {
		throw new Error("Invalid domain or path. Expected a Wikipedia/Wikimedia article URL, e.g. https://en.wikipedia.org/wiki/Node.js");
	}
	let title = extractWikiTitle(parsedUrl);

	if (!title) {
		throw new Error("Unable to extract title. Expected a URL with title, e.g. https://en.wikipedia.org/wiki/Node.js");
	}

	// load
	let src = await loadSource(parsedUrl, title);

	// save
	const filePath = buildOutputPath(outputPath, parsedUrl.hostname, title);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, src, "utf8");

	console.log(`Saved: ${title}`);
}

main().catch(error => {
	console.error(error.message);
	process.exit(1);
});