/**
 * Drag'n'Drop (DnD).
 *
 * Drag links from Wikipedia article frame to WD to create statements.
 *
 * For created statements adds "imported from" (P143) as reference.
 *
 * Note that the trigger to open Wikipedia article is a button beside interwiki.
 * The trigger button is using this image:
 * https://commons.wikimedia.org/wiki/File:PICOL_Comment_add.svg
 *
 * Primary author: Yarl.
 * Other authors: Nux.
 */

/* global $, OO */
/* eslint-disable no-useless-escape */

// load deps and run `dragNDrop()` when ready
mw.loader.using(
	[
		'wikibase.ui.entityViewInit',
		'jquery.ui',
		'oojs',
		'oojs-ui-core',
		'oojs-ui-widgets'
	],
	function onReady() {
		$(document).ready(dragNDrop);
	},
	function onError(error) {
		console.error(error);
	},
);

function dragNDrop() {
	let itemId = mw.config.get('wbEntityId');
	let lang = mw.config.get('wgUserLanguage');

	let api = new mw.Api();
	let dialog = {};
	let params = {};
	let windowManager = null;

	// i18n
	let texts = (function texts() {
		const translations = {
			en: {
				close: 'Close',
				loading: 'Loading...',
				noSuggestedProperties: 'No suggestions found. You will find list of frequently used properties below.',
				open: 'Open',
				saveFail: 'Unfortunately, saving failed',
				searchPlaceholder: 'Search for property by name or number',
				searchResults: 'Search results',
				suggestedProperties: 'Suggested properties',
				addStatment: 'Add statement',
				addExistingStatement: 'Add statement to already added property',
				valueAlreadyUsed: 'This value is already used %s time(s)!',
			},
			pl: {
				close: 'Zamknij',
				loading: 'Wczytywanie...',
				open: 'Otwórz',
				saveFail: 'Zapisywane nie powiodło się.',
				noSuggestedProperties: 'Brak wyników. Poniżej znajduje się lista często używanych właściwości.',
				searchPlaceholder: 'Szukaj właściwości według nazwy lub numeru',
				searchResults: 'Wyniki wyszukiwania',
				suggestedProperties: 'Sugerowane właściwości',
				addStatment: 'Dodaj stwierdzenie',
				addExistingStatement: 'Dodaj stwierdzenie do już istniejącej właściwości',
				valueAlreadyUsed: 'Ta wartość została już użyta %s raz(y)!',
			},
		};
		let chain = mw.language.getFallbackLanguageChain();
		let ret = {};

		for (const language of chain.reverse()) {
			if (Object.prototype.hasOwnProperty.call(translations, language)) {
				Object.assign(ret, translations[language]);
			}
		}
		return ret;
	}());

	const wikiIdentifiers = {
		arwikipedia: 'Q199700',
		cawikipedia: 'Q199693',
		cebwikipedia: 'Q837615',
		dawikipedia: 'Q181163',
		dewikipedia: 'Q48183',
		elwikipedia: 'Q11918',
		enwikipedia: 'Q328',
		euwikipedia: 'Q207260',
		fiwikipedia: 'Q175482',
		frwikipedia: 'Q8447',
		eowikipedia: 'Q190551',
		eswikipedia: 'Q8449',
		glwikipedia: 'Q841208',
		hewikipedia: 'Q199913',
		iawikipedia: 'Q3757068',
		iewikipedia: 'Q6167360',
		iowikipedia: 'Q1154766',
		itwikipedia: 'Q11920',
		jawikipedia: 'Q177837',
		mkwikipedia: 'Q842341',
		nlwikipedia: 'Q10000',
		plwikipedia: 'Q1551807',
		ptwikipedia: 'Q11921',
		ruwikipedia: 'Q206855',
		svwikipedia: 'Q169514',
		trwikipedia: 'Q58255',
		ukwikipedia: 'Q199698',
		viwikipedia: 'Q200180',
		vowikipedia: 'Q714826',
		zhwikipedia: 'Q30239',
	};

	// Load CSS
	mw.loader.load('https://www.wikidata.org/w/index.php?title=User:Nux/DragNDrop.css&action=raw&ctype=text/css', 'text/css');

	/**
	 *
	 * @param {*} config
	 */
	function AddStatementDialog(config) {
		AddStatementDialog.super.call(this, config);
		this.pageName = config.pageName;
		this.pageWikidataId = config.pageWikidataId;
		this.pageWikidataImage = config.pageWikidataImage;
		this.pageWikidataExtLink = config.pageWikidataExtLink;
		this.pageWikidataCoordinates = config.pageWikidataCoordinates;
	}

	OO.inheritClass(AddStatementDialog, OO.ui.ProcessDialog);
	AddStatementDialog.prototype.initialize = initAddStatementDialog;
	AddStatementDialog.prototype.getBodyHeight = function () { return 350; };
	AddStatementDialog.static.name = 'addStatementDialog';
	AddStatementDialog.static.title = '.';
	AddStatementDialog.static.actions = [
		{ label: texts.close, flags: 'safe' },
	];

	/**
	 * Adds grey box that mocks declaration item
	 * @param {String} property Property number, eg. 'P131'
	 * @param {String} value Item number, eg. 'Q12345'
	 */
	function addDeclarationBox(property, propertyName, value, valueName) {
		var html = [
			'<div class="wikibase-statementgroupview listview-item" id="' + property + '">',
			'<div class="wikibase-statementgroupview-property">',
			'<div class="wikibase-statementgroupview-property-label" dir="auto">',
			'<a href="/wiki/Property:' + property + '" original-title=".">' + propertyName + '</a>',
			'</div></div>',
			'<div class="wikibase-statementlistview">',
			'<div class="wikibase-statementlistview-listview">',
			'<div class="wikibase-statementview wb-normal listview-item wikibase-toolbar-item">',
			'<div class="wikibase-statementview-mainsnak-container">',
			'<div class="wikibase-statementview-mainsnak" dir="auto">',
			'<div class="wikibase-snakview">',
			'<div class="wikibase-snakview-value-container" dir="auto">',
			'<div class="wikibase-snakview-body">',
			'<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak">',
			'<a title="' + value + '" href="/wiki/' + value + '">' + valueName + '</a>',
			'</div></div></div></div></div></div></div></div></div></div>',
		].join('');

		$('.dragndrop__statements-cointainer')
			.append(html);
	}

	/**
	 * Searches for property number based on `searchText`. Used in Add Statement dialog.
	 * @param {String} searchText property name ("instance of") or number ("P131")
	 * @param {Function} callback
	 */
	function searchProperty(searchText, callback) {
		genericAPIaction({
			action: 'wbsearchentities',
			format: 'json',
			limit: 10,
			language: lang,
			uselang: lang,
			useCirrus: 1,
			search: searchText,
			type: 'property',
		}, callback);
	}

	/**
	 *
	 */
	function getHeader(label, icon) {
		var header = new OO.ui.FieldsetLayout({
			label: label,
			icon: icon,
		});

		return $('<div></div>')
			.addClass('dragndrop__results-header')
			.append([header.$element]);
	}

	/**
	 *
	 */
	function getSearchHeader() {
		return getHeader(texts.searchResults, 'search');
	}

	/**
	 *
	 */
	function getSuggestionsHeader() {
		return getHeader(texts.suggestedProperties, 'star');
	}

	/**
	 * Prints the list of results
	 */
	function getResultsList(results) {
		var list = results
			.map(function (item) {
				var isPropAdded = $('#' + item.propertyId).length;
				var $button = new OO.ui.ButtonWidget({
					icon: isPropAdded ? 'alert' : 'add',
					iconTitle: isPropAdded ? texts.addExistingStatement : texts.addStatment,
					classes: ['dragndrop__add-statement-link'],
					flags: 'progressive',
				}).$element
					.attr({
						propertyLabel: item.label,
						property: item.propertyId,
					});

				var $link = $('<a href="https://www.wikidata.org/wiki/Property:' + item.propertyId + '" target="_blank">' + item.label + '<a/>');
				var $propLink = $('<a href="https://www.wikidata.org/wiki/Property:' + item.propertyId + '" target="_blank">' + item.propertyId + '</a>');

				var $header = $('<div></div>')
					.append([
						$link,
						'<span> (</span>', $propLink, '<span>)<span>',
					]);

				var $description = $('<div></div>')
					.addClass('dragndrop__result-item-description')
					.append([item.description]);

				return $('<div></div>')
					.addClass('dragndrop__result-item')
					.append([
						$button,
						$header,
						$description,
					]);
			});

		return $('<div></div>')
			.addClass('dragndrop__results-list')
			.append(list);
	}

	/**
	 *
	 * @param {String} pageWikidataId
	 */
	function findDuplicates(pageWikidataId) {
		if (!pageWikidataId) {
			return false;
		}

		var selector = "[href='/wiki/" + pageWikidataId + "']";
		var selection = document.querySelectorAll(selector);

		if (selection.length) {
			return new OO.ui.FieldsetLayout({
				label: texts.valueAlreadyUsed.replace('%s', selection.length),
				icon: 'alert',
			}).$element;
		}
		return false;
	}

	/**
	 *
	 */
	function initAddStatementDialog() {
		var content = new OO.ui.PanelLayout({ padded: true, expanded: false });
		var progressBar = new OO.ui.ProgressBarWidget({ progress: false });
		var search = new OO.ui.TextInputWidget({
			placeholder: texts.searchPlaceholder,
			icon: 'search',
		});

		var pageName = this.pageName;
		var pageWikidataId = this.pageWikidataId;
		var pageWikidataImage = this.pageWikidataImage;
		var pageWikidataExtLink = this.pageWikidataExtLink;
		var pageWikidataCoordinates = this.pageWikidataCoordinates;

		var $loading = $('<p class="dragndrop__loading-info"></p>').text(texts.loading);
		var $header = $('<div class="dragndrop__window-header"></div>').append(search.$element);
		var $noResults = $('<div class="dragndrop__results-list"><em>' + texts.noSuggestedProperties + '</em></div>');
		var $searchResults = $('<div class="dragndrop__results"></div>');
		var $suggestions = $('<div class="dragndrop__results"></div>').append($loading);
		var $duplicates = $('<div class="dragndrop__duplicates"></div>');

		AddStatementDialog.super.prototype.initialize.apply(this, arguments);
		AddStatementDialog.static.title = [
			pageName,
			pageWikidataId && ' (' + pageWikidataId + ')',
		].join(' ');

		$duplicates.append(
			findDuplicates(pageWikidataId),
		);

		search.$input.keyup(
			debounce(function onInputChange() {
				var searchText = $(this).val();
				if (!searchText) {
					$searchResults.empty();
					return;
				}

				$searchResults
					.empty()
					.append([getSearchHeader(), $loading]);

				searchProperty(
					searchText,
					function success(data) {
						var results = data.search.map(function (item) {
							return {
								propertyId: item.id,
								label: item.label,
								description: item.description,
							};
						});

						$searchResults
							.empty()
							.append([
								getSearchHeader(),
								getResultsList(results),
							]);
					},
				);
			}, 500),
		);

		content.$element.append(
			findDuplicates(pageWikidataId) && $duplicates,
			$header,
			$searchResults,
			$suggestions,
		);
		this.content = content;
		this.$body.append(content.$element);

		if (pageWikidataId) {
			getPropertySuggestions(
				pageWikidataId,
				onPropertiesListSuccess,
			);
		} else if (pageWikidataImage) {
			getPropertyDefaults(
				['P18', 'P109', 'P1442'],
				onPropertiesListSuccess,
			);
		} else if (pageWikidataExtLink) {
			getPropertyDefaults(
				['P856'],
				onPropertiesListSuccess,
			);
		} else if (pageWikidataCoordinates) {
			getPropertyDefaults(
				['P625'],
				onPropertiesListSuccess,
			);
		}

		function onPropertiesListSuccess(results) {
			if (results.length) {
				$suggestions
					.empty()
					.append([
						getSuggestionsHeader(),
						results[0].isDefault ? $noResults : '',
						getResultsList(results),
					]);
			} else {
				getPropertyDefaults(
					['P31', 'P279', 'P361', 'P527', 'P131'],
					onPropertiesListSuccess,
				);
			}
		}

		$('.oo-ui-window-body').on(
			'click', '.dragndrop__add-statement-link',
			function onClickAddStatement() {
				var property = $(this).attr('property');
				var propertyName = $(this).attr('propertyLabel');

				// add class for styling
				$('.dragndrop__statements-cointainer')
					.addClass('wikibase-statementgrouplistview');

				$header.append(progressBar.$element);
				if (pageWikidataId) {
					addStatement(property, pageWikidataId, onAddStatementSuccess);
				} else if (pageWikidataImage) {
					addStatementString(property, pageWikidataImage, onAddStatementSuccess);
				}  else if (pageWikidataExtLink) {
					addStatementString(property, pageWikidataExtLink, onAddStatementSuccess);
				} else if (pageWikidataCoordinates) {
					addStatementCoordinates(property, pageWikidataCoordinates, onAddStatementSuccess);
				}

				function onAddStatementSuccess(data) {
					var identifier = wikiIdentifiers[params.lang + params.project] || '';
					if (identifier) {
						addReference(data.claim.id, identifier, onAddReferenceSuccess);
					} else {
						onAddReferenceSuccess();
					}
				}

				function onAddReferenceSuccess() {
					addDeclarationBox(property, propertyName, pageWikidataId, pageName);
					windowManager.closeWindow(dialog);
				}
			},
		);
	}

	/**
	 *
	 */
	function genericAPIaction(json, callback) {
		json.summary = '#drag-n-drop';
		api
			.postWithEditToken(json)
			.done(callback)
			.fail(function err() {
				OO.ui.alert(texts.saveFail);
				windowManager.closeWindow(dialog);
			});
	}

	/**
	 *
	 * @param {String} query SPARQL query
	 * @param {Function} callback
	 */
	function getSPARQL(query, callback) {
		var endpoint = '//query.wikidata.org/bigdata/namespace/wdq/sparql';

		$.get(endpoint, {
			format: 'json',
			query: query,
		}, function success(data) {
			var results = data.results.bindings
				.map(function simplityResult(item) {
					return {
						propertyId: item.property.value.split('/').pop(),
						label: item.propertyLabel.value,
						description: item.propertyDescription.value,
						isDefault: item.isDefault,
					};
				});
			callback(results);
		});
	}

	function getPropertyDefaults(list, callback) {
		var langs = [lang, 'en'].join(',');
		var props = list
			.map(function (element) { return 'wd:' + element; })
			.join(' ');
		var query = [
			'SELECT ?property ?propertyLabel ?propertyDescription ?isDefault WHERE {',
			'BIND("Yes" AS ?isDefault)',
			'VALUES ?property { ' + props + ' }',
			'SERVICE wikibase:label { bd:serviceParam wikibase:language "' + langs + '". }',
			'}',
		].join(' ');

		getSPARQL(query, callback);
	}

	/**
	 * Get suggestions of properties that matches given item
	 * @param {String} id Wikidata identifier
	 * @param {Function} callback On success callback function
	 */
	function getPropertySuggestions(id, callback) {
		var langs = [lang, 'en'].join(',');
		var query = [
			'SELECT ?property ?propertyLabel ?propertyDescription ?count WHERE {',
			'{',
			'SELECT ?property (COUNT(?item) as ?count)',
			'WHERE { ?item ?wdt wd:' + id + ' . ?property wikibase:directClaim ?wdt }',
			'GROUP BY ?property ?propertyLabel',
			'HAVING(?count > 1)',
			'}',
			'SERVICE wikibase:label { bd:serviceParam wikibase:language "' + langs + '". }',
			'}',
			'ORDER BY DESC(?count)',
		].join(' ');

		getSPARQL(query, callback);
	}

	/**
	 * Shows dialog window with adding statement
	 * @param {Object} page information about wikipage that will be added as statement
	 */
	function showAddStatementDialog(page) {
		dialog = new AddStatementDialog({
			pageName: page.name,
			pageWikidataId: page.wikidataId,
			pageWikidataImage: page.wikidataImage,
			pageWikidataExtLink: page.wikidataExtLink,
			pageWikidataCoordinates: page.wikidataCoordinates,
		});
		windowManager.addWindows([dialog]);
		windowManager.openWindow(dialog);
	}

	/**
	 * Adds statement
	 * @param {string} property
	 * @param {string} value
	 * @param {function} callback
	 */
	function addStatement(property, value, callback) {
		var val = {
			'entity-type': 'item',
			'numeric-id': +value.substring(1),
		};
		genericAPIaction({
			action: 'wbcreateclaim',
			entity: itemId,
			snaktype: 'value',
			property: property,
			value: JSON.stringify(val),
		}, callback);
	}

	/**
	 * Adds string statement
	 * @param {string} property
	 * @param {string} value
	 * @param {function} callback
	 */
	function addStatementString(property, value, callback) {
		genericAPIaction({
			action: 'wbcreateclaim',
			entity: itemId,
			snaktype: 'value',
			property: property,
			value: '"' + value + '"',
		}, callback);
	}

	/**
	 * Adds coordinates statement
	 * @param {string} property
	 * @param {Array<string>} lat/lon values
	 * @param {function} callback
	 */
	function addStatementCoordinates(property, value, callback) {
		var val = {
			latitude: value[0],
			longitude: value[1],
			globe: 'http://www.wikidata.org/entity/Q2',
			precision: 0.00001
		};
		genericAPIaction({
			action: 'wbcreateclaim',
			entity: itemId,
			snaktype: 'value',
			property: property,
			value: JSON.stringify(val),
		}, callback);
	}

	/**
	 *
	 * @param {String} claimId
	 * @param {String} value
	 * @param {Function} callback
	 */
	function addReference(claimId, value, callback) {
		var snaks = {
			P143: [{
				snaktype: 'value',
				property: 'P143',
				datavalue: {
					type: 'wikibase-entityid',
					value: { id: value },
				},
			}],
			P813: [{
				snaktype: 'value',
				property: 'P813',
				datavalue: {
					type: 'time',
					value: {
						after: 0,
						before: 0,
						calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
						precision: 11,
						time: '+' + new Date().toISOString().substring(0, 10) + 'T00:00:00Z',
						timezone: 0,
					},
				},
			}],
		};
		genericAPIaction({
			action: 'wbsetreference',
			statement: claimId,
			snaks: JSON.stringify(snaks),
		}, callback);
	}

	/**
	 * Adds drop area for links from the overlay
	 */
	function addDropArea() {
		$('.wikibase-entityview-main').droppable({
			accept: function accept(dropped) {
				return $(dropped).hasClass('dragndrop__link');
			},
			drop: function drop(event, ui) {
				var link = $(ui.draggable);

				if (!link.hasClass('dragndrop__link')) {
					return;
				}

				if (link.hasClass('image')) {
					dropImage(link);
				} else if (link.hasClass('external')) {
					dropExtLink(link);
				} else {
					dropWikiLink(link);
				}
			},
			hoverClass: 'dragndrop__droptarget',
		});
	}

	/**
	 * Adds start button next to sitelink that triggers overlay
	 * @param {Object} $sitelinkView jQuery sitelink view element
	 * @param {String} projectName name of project, eg. 'wikipedia'
	 */
	function addButtonToSitelink($sitelinkView, projectName) {
		var $link = $sitelinkView.find('a[hreflang]');

		var $button = $('<button></button>')
			.addClass('dragndrop__button')
			.attr('data-project', projectName)
			.attr('data-lang', $link.attr('hreflang'))
			.attr('data-page', $link.attr('title'))
			.attr('title', 'DnD: ' + $link.attr('title'))
			.append(
				$('<img>', {
					src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/PICOL_Comment_add.svg',
					alt: 'DnD',
					width: 15,
					height: 15
				})
			)
			.click(openOverlay);

		$sitelinkView.prepend($button);
	}

	/**
	 * Adds start button to group of links
	 * @param {String} projectName name of project, eg. 'wikipedia'
	 */
	function addButtonToSitelinkGroup(projectName) {
		var sitelinkGroupSelector = [
			'.wikibase-sitelinkgroupview',
			'[data-wb-sitelinks-group="' + projectName + '"]',
		].join('');

		$(sitelinkGroupSelector)
			.find('li.wikibase-sitelinkview')
			.each(function () { addButtonToSitelink($(this), projectName); });
	}

	/**
	 * Adds start button to all groups of links
	 */
	function addButtonToSitelinkGroups() {
		[
			'wikipedia',
		].forEach(addButtonToSitelinkGroup);
	}

	/**
	 * Converts unused TOC into container of newly added statements
	 */
	function addStatementsContainer() {
		var container = $('<div></div>')
			.addClass('dragndrop__statements-cointainer');

		$('#toc').after(container);
	}

	// http://davidwalsh.name/javascript-debounce-function
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this;
			var args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	/**
	 * Action on coordinates drop.
	 */
	function dropCoordinates(link) {
		let match = link
			.attr('href')
			.replace(/_/g,' ')
			.match(/\bgeohack\.php.*params=([0-9\.+\-]+) ([NS]) ([0-9\.+\-]+) ([EW])/);

		if (match) {
			let lat = match[1] * 1 ;
			let lon = match[3] * 1 ;
			if(match[2] === 'S') lat = -lat;
			if(match[4] === 'W') lon = -lon;

			showAddStatementDialog({
				name: decodeURIComponent([lat, lon].join(' / ')),
				wikidataCoordinates: [lat, lon],
			});
		}
	}

	/**
	 * Action on image drop
	 */
	function dropImage(link) {
		var linkName = link
			.attr('href')
			.substring(link.attr('href').indexOf(':') + 1)
			.replace(/_/g, ' ');

		showAddStatementDialog({
			name: decodeURIComponent(linkName),
			wikidataImage: decodeURIComponent(linkName),
		});
	}

	/**
	 * Action on extenral link drop
	 */
	function dropExtLink(link) {
		var linkName = link.attr('href');

		if(linkName.indexOf('geohack.php') > -1) {
			dropCoordinates(link);
			return;
		}

		showAddStatementDialog({
			name: decodeURIComponent(linkName),
			wikidataExtLink: decodeURIComponent(linkName),
		});
	}

	/**
	 * Action on link drop. Queries Wikipedia in order to get Wikidata ID
	 */
	function dropWikiLink(link) {
		var url = '//' + params.lang + '.' + params.project + '.org/w/api.php?callback=?';

		if (link.attr('href').indexOf('#cite_note') > -1) {
			return;
		}

		$.getJSON(url, {
			action: 'query',
			redirects: 1,
			prop: 'pageprops',
			titles: link.attr('title'),
			format: 'json',
		}, function callback(data) {
			var pages = data.query.pages;

			var targetPageId = Object.keys(pages)[0];
			var targetPageName = pages[targetPageId].title;
			var targetPageWikidataId = pages[targetPageId].pageprops.wikibase_item;

			showAddStatementDialog({
				name: targetPageName,
				wikidataId: targetPageWikidataId,
			});
		});
	}

	/**
	 *
	 */
	function getOverlayHeader(title) {
		var html = [
			'<div class="oo-ui-window-head">',
			'<div class="oo-ui-processDialog-navigation">',
			'<div class="oo-ui-processDialog-location">',
			'<label class="oo-ui-widget oo-ui-widget-enabled oo-ui-processDialog-title" aria-disabled="false" title="' + title + '">' + title + '</label>',
			'</div>',
			'<div class="oo-ui-processDialog-actions-safe">',
			'<span class="oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-labelElement oo-ui-actionWidget" aria-disabled="false">',
			'<a class="oo-ui-buttonElement-button" role="button" tabindex="0" aria-disabled="false" rel="nofollow">',
			'<span class="oo-ui-labelElement-label">' + texts.close + '</span>',
			'</a></span></div></div></div>',
		].join('');

		var $header = $(html);
		$header
			.find('a.oo-ui-buttonElement-button')
			.click(closeOverlay);

		return $header;
	}

	/**
	 *
	 */
	function getOverlayBody() {
		var html = [
			'<div class="dragndrop__overlay-body oo-ui-window-body">',
			'<i>' + texts.loading + '</i>',
			'</div>',
		].join('');

		var $overlay = $(html);
		return $overlay
			.css({
				height: 'calc(100% - 50px - 2.5em)',
				overflow: 'scroll',
				padding: '1.25em',
			});
	}

	/**
	 *
	 */
	function getOverlayContainer() {
		var $container = $('<div></div>')
			.addClass('dragndrop__overlay oo-ui-processDialog-content')
			.draggable({
      	handle: '.oo-ui-window-head'
			});

		return $container;
	}

	/**
	 *
	 */
	function getArticle(callback) {
		var url = '//' + params.lang + '.' + params.project + '.org/w/api.php?callback=?';

		$.getJSON(url, {
			action: 'parse',
			page: params.title,
			format: 'json',
			prop: 'text',
			mobileformat: 1,
		}, callback);
	}

	/**
	 *
	 */
	function transformLink() {
		var link = $(this);
		var badClasses = ['.new', '.external', '.extiw'].join(',');

		if (link.hasClass('new')) {
			removeLink(link);
		}

		if (link.hasClass('external')) {
			transformExtLink(link);
		}

		if (!link.is(badClasses)) {
			transformWikiLink(link);
		}
	}

	/**
	 * Converts <a> tag (or any other) to <span>
	 * @param {Object} link jQuery link element
	 */
	function removeLink(link) {
		var text = link.text();
		var span = $('<span></span>').text(text);
		link.replaceWith(span);
	}

	/**
	 * Transforms internal blue wikilink to draggable link
	 */
	function transformWikiLink(link) {
		link
			.css({ cursor: 'grab', hover: 'background-color:#6094DB' })
			.addClass('dragndrop__link')
			.attr('href', '//' + params.lang + '.' + params.project + '.org' + link.attr('href'));

		link.draggable({
			appendTo: 'body',
			revert: false,
			cursor: 'dragging',
			helper: 'clone',
		});
	}

	/**
	 * Transforms external link to draggable link
	 */
	function transformExtLink(link) {
		link
			.css({ cursor: 'grab', hover: 'background-color:#6094DB' })
			.addClass('dragndrop__link');

		link.draggable({
			appendTo: 'body',
			revert: false,
			cursor: 'dragging',
			helper: 'clone',
		});
	}

	function closeOverlay() {
		$('.dragndrop__overlay').remove();
	}

	/**
	 * Open article frame/dialog.
	 */
	function openOverlay() {
		let $btn = $(this);

		params = {
			lang: $btn.attr('data-lang'),
			project: $btn.attr('data-project'),
			title: $btn.attr('data-page'),
		};

		var $overlayHeader = getOverlayHeader(params.title);
		var $overlayBody = getOverlayBody();
		var $overlayContainer = getOverlayContainer()
			.append($overlayHeader)
			.append($overlayBody);

		closeOverlay();

		var $dragContainer = $('<div></div>')
			.addClass('dragndrop__drag-overlay')
			.append($overlayContainer);

		$('body').append($dragContainer);

		getArticle(
			function callback(data) {
				$('.dragndrop__overlay-body')
					.html(data.parse.text['*'])
					.find('a')
					.each(transformLink);
			},
		);
	}

	// Initialization
	if (itemId !== null &&
    mw.config.get('wgNamespaceNumber') === 0 &&
    mw.config.get('wgAction') === 'view') {
		$(function start() {
			windowManager = new OO.ui.WindowManager();
			$('body').append(windowManager.$element);

			addButtonToSitelinkGroups();
			addDropArea();
			addStatementsContainer();
		});
	}
}