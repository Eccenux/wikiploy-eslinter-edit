import { DeployConfig } from "wikiploy";
import { restoreUnsafePath } from "./load-helper.mjs";

/**
 * Extracts wiki source mapping from a local file path.
 *
 * @param {string} filePath Assumes path in download.mjs style (site/User.ns.Some.p.script.js).
 * @returns {{ site: string, src: string, dst: string }}
 */
export function parseWikiSourcePath(filePath) {
	const parts = filePath.split(/[\\/]+/);
	const src = parts.at(-1);
	const site = parts.at(-2);

	if (!site || !src) {
		throw new Error(`Invalid wiki source path: ${filePath}`);
	}

	return {
		site,
		src: filePath,
		dst: restoreUnsafePath(src),
	};
}

/**
 * Adds a deploy configuration for the file.
 *
 * @param {DeployConfig[]} configs Target list of deploy configurations.
 * @param {string} filePath Local source file path. Assumes path in download.mjs style (site/User.ns.Some.p.script.js).
 * @returns {void}
 */
export function addPloyConfig(configs, filePath) {
	let config = parseWikiSourcePath(filePath);
	console.log('will deploy to:', config.site, '; title:', config.dst);
	configs.push(new DeployConfig(config));
}

let test = 0;
if (test) {
	console.log(parseWikiSourcePath(String.raw`src\commons.wikimedia.org\MediaWiki.ns.PermissionsRequestsDesk.js`));
	console.log(parseWikiSourcePath(String.raw`src/commons.wikimedia.org/MediaWiki.ns.PermissionsRequestsDesk.js`));
	console.log(parseWikiSourcePath(`src/commons.wikimedia.org/User.ns.Nux.S.PermissionsRequestsDesk.dev.js`));
}