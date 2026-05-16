/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy, setupSummary } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "pl.wikipedia.org";

(async () => {
	// custom summary
	let summary = 'change from Github'; // default
	let version = '';
	await setupSummary(ployBot, version, summary); // get from cli

	// deploy
	const configs = [];
	configs.push(new DeployConfig({
		site: 'pl.wikipedia.org',
		src: 'Gadget-lib-toolbar.js',
		dst: 'MediaWiki:Gadget-lib-toolbar.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});