/* eslint-disable no-unused-vars */
/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy, setupSummary } from 'wikiploy';

import * as botpass from './bot.config.mjs';
import { addPloyConfig } from './inc/deploy-helper.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "pl.wikipedia.org";

(async () => {
	const configs = [];

	// can use Windows or Linux style
	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.PermissionsRequestsDesk.js`);
	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.Group-sysop.js`);

	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.Gadget-Cat-a-lot.js`);
	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.Gadget-Cat-a-lot.js.S.pl`);
	// addPloyConfig(configs, String.raw`src\pl.wikipedia.org\MediaWiki.ns.Gadget-Cat-a-lot.js`);

	// example: https://commons.wikimedia.org/wiki/Template:OWID/Chicken_meat_production
	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.Gadget-owidslider.js`);
	// addPloyConfig(configs, String.raw`src\commons.wikimedia.org\MediaWiki.ns.Gadget-owidslider.css`);

	// addPloyConfig(configs, String.raw`src\pl.wikipedia.org\MediaWiki.ns.Gadget-quickeditcounter.js`);
	addPloyConfig(configs, String.raw`src\pl.wikipedia.org\MediaWiki.ns.Gadget-topalert.css`);

	// custom summary
	let summary = 'change from Github'; // default
	let version = '';
	await setupSummary(ployBot, version, summary); // get from cli

	// deploy
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});