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
	// can use Windows or Linux style
	let file = String.raw`src\commons.wikimedia.org\MediaWiki.ns.PermissionsRequestsDesk.js`;

	const configs = [];
	addPloyConfig(configs, file);

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