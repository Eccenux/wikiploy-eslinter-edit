# wikiploy-eslinter-edit

Developer tooling for editing, linting, and deploying Wikimedia JavaScript pages without
[re-auth added in 2026](https://phabricator.wikimedia.org/T197137).

This repository provides a small workflow around:

- downloading raw JavaScript source from Wikimedia/MediaWiki pages (`download.mjs`);
- linting files with ESLint;
- deploying edited files back to the target wiki using Wikiploy (`wikiploy.mjs`).

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Project structure](#project-structure)
- [Downloading a wiki page](#downloading-a-wiki-page)
- [Linting](#linting)
- [Deployment](#deployment)
	- [Bot config](#bot-config)
	- [File to deploy](#file-to-deploy)
	- [Run deployment](#run-deployment)
- [Final notes](#final-notes)
- [License](#license)

## Requirements

- Node.js 20.19.0 or newer (mostly for the linter).
- A Wikimedia bot password configuration for deployment. You don't need a bot account though (bot password is just a token).

## Installation

```bash
npm ci
```

## Project structure

```text
.
├── download.mjs          # Downloads raw wiki page source into ./src
├── wikiploy.mjs          # Deployment entry point
├── eslint.config.mjs     # ESLint flat config
├── inc/                  # Helpers
└── src/                  # Downloaded wiki sources, created locally
```

## Downloading a wiki page

Run:
```bash
node download.mjs <url>
```

Supported URL formats:
```text
https://example.org/wiki/Page_Title
https://example.org/w/index.php?title=Page_Title
```

The downloader stores source files under `src/<hostname>/<safe-title>`.

Example target path:
```text
src/commons.wikimedia.org/MediaWiki.ns.PermissionsRequestsDesk.js
```

## Linting

Run ESLint:
```bash
npm run lint
```

## Deployment

Deployment is handled by `wikiploy.mjs`.
Edit the file to change `let file = ...`.

### Bot config

Before deploying, create a local bot config file:
```text
bot.config.mjs
```

This file is ignored by Git and should contain private credentials.

`wikiploy.mjs` imports it as:
```js
import * as botpass from './bot.config.mjs';
```

### File to deploy

The deployment script maps local files back to wiki page titles. For example:
```text
src/commons.wikimedia.org/MediaWiki.ns.PermissionsRequestsDesk.js
```
is deployed to:
```text
commons.wikimedia.org/wiki/MediaWiki:PermissionsRequestsDesk.js
```

Remember to edit `wikiploy.mjs` to change path in: `let file = ...`.

Example:
```js
let file = String.raw`src\commons.wikimedia.org\MediaWiki.ns.PermissionsRequestsDesk.js`;
```

Both Windows and POSIX-style paths are supported:

```js
src\commons.wikimedia.org\MediaWiki.ns.PermissionsRequestsDesk.js
src/commons.wikimedia.org/MediaWiki.ns.PermissionsRequestsDesk.js
```

### Run deployment

```bash
node wikiploy.mjs
```

## Final notes

* `bot.config.*` files are ignored and must not be committed.
* Downloaded source files will be placed under `src/`. This is handled automatically by `download.mjs`.
* [VS Code](https://code.visualstudio.com/) is recommended for making edits, but it is not required. VS Code has built-in ESLint integration and terminals, though some other IDEs provide similar features.
* Deployment is currently configured by editing `wikiploy.mjs` directly.

So in short:
0. `node download.mjs ...`
0. Edit downloaded file(s).
0. Add the relative path to `wikiploy.mjs`
0. `node wikiploy.mjs`

## License

MIT, Maciej Nux Jaros.
