export async function loadSource(parsedUrl, title) {
	let apiUrl = parsedUrl.origin + `/w/index.php?title=${encodeURIComponent(title)}&action=raw`;

	const response = await fetch(apiUrl, {
		headers: {
			"User-Agent": "wiki-downloader/1.0 (wikipedia:pl; User:Nux)",
		},
	});
	if (!response.ok) {
		throw new Error(`Download failed: ${response.status} ${response.statusText}`);
	}

	let src = await response.text();
	return src;
}

/**
 * Extracts MediaWiki title from common URL formats:
 * - /wiki/Some_Title
 * - /w/index.php?title=Some_Title&...
 *
 * @param {string | URL} url
 * @returns {string | null}
 */
export function extractWikiTitle(url) {
	const parsedUrl = url instanceof URL ? url : new URL(url);

	if (parsedUrl.pathname.startsWith('/wiki/')) {
		return decodeURIComponent(parsedUrl.pathname.replace(/^\/wiki\//, ''));
	}

	if (parsedUrl.pathname === '/w/index.php') {
		const title = parsedUrl.searchParams.get('title');

		return title ? decodeURIComponent(title) : null;
	}

	return null;
}

import path from 'node:path';

function safePathPart(value) {
	return value
		.replaceAll('\\', '_')
		.replaceAll('/', '_')
		.replaceAll(':', '.ns.')
		.replaceAll('*', '_')
		.replaceAll('?', '_')
		.replaceAll('"', '_')
		.replaceAll('<', '_')
		.replaceAll('>', '_')
		.replaceAll('|', '_')
		.replace(/\s+/g, '_')
		.replace(/_+/g, '_')
		.slice(0, 180);
}

/**
 * Builds a safe output path.
 *
 * @param {string} outputPath
 * @param {string} hostname
 * @param {string} title
 * @returns {string}
 */
export function buildOutputPath(outputPath, hostname, title) {
	let safeHost = safePathPart(hostname);
	let safeTitle = safePathPart(title);

	let resultPath = path.resolve(outputPath, safeHost, safeTitle);
	let basePath = path.resolve(outputPath);

	if (!resultPath.startsWith(basePath + path.sep)) {
		throw new Error('Unsafe output path');
	}

	return resultPath;
}

let test = 0;
if (test) {
	// Examples:
	console.log(extractWikiTitle('https://en.wikipedia.org/wiki/Albert_Einstein'));
	// Albert_Einstein

	console.log(extractWikiTitle('https://commons.wikimedia.org/w/index.php?title=MediaWiki%3APermissionsRequestsDesk.js&diff=1078848943&oldid=1078848781'));
	// MediaWiki:PermissionsRequestsDesk.js
}
