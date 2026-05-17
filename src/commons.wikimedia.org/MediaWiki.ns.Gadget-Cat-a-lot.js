/* eslint-disable no-useless-assignment */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/**
* Cat-a-lot
* Changes category of multiple files
*
* @rev 00:13, 10 February 2018 (UTC)
* @author Originally by Magnus Manske (2007)
* @author RegExes by Ilmari Karonen (2010)
* @author Completely rewritten by DieBuche (2010-2012)
* @author Rillke (2012-2014)
* @author Perhelion (2017)
* @author Zache (2024)
* @author Maciej Nux (2026)
* @author Outreachy 30: Adiba_anjum3, Ademola01, Gvutong, Nenyee, Nidhicodes1858, Shellygarg10, Isaacbriandt (2025)

* Requires [[MediaWiki:Gadget-SettingsManager.js]] and [[MediaWiki:Gadget-SettingsUI.js]] (properly registered) for per-user-settings
* Requires [[MediaWiki:Gadget-libAPI.js]] for editing
*
* READ THIS PAGE IF YOU WANT TO TRANSLATE OR USE THIS ON ANOTHER SITE:
* https://commons.wikimedia.org/wiki/Help:Gadget-Cat-a-lot/translating
* <nowiki>
*/

/* global jQuery, mediaWiki */
/* eslint one-var:0, vars-on-top:0, no-underscore-dangle:0, valid-jsdoc:0,
curly:0, camelcase:0, no-useless-escape:0, no-alert:0 */ // extends: wikimedia
/* jshint unused:true, forin:false, smarttabs:true, loopfunc:true, browser:true */

( function ( $, mw ) {
'use strict';

var formattedNS = mw.config.get( 'wgFormattedNamespaces' ),
	ns = mw.config.get( 'wgNamespaceNumber' ),
	nsIDs = mw.config.get( 'wgNamespaceIds' ),
	userGrp = mw.config.get( 'wgUserGroups' ),
	project = mw.config.get( 'wgDBname' );

/**
 * I18n.
 * Note! Keep in sync with: [[Help:Gadget-Cat-a-lot/translating]]
 */
var msgs = {
	// Preferences
	// new added: 2025-11-04. Please translate.
	// Use user language for i18n
	'cat-a-lot-label'          : 'Cat-a-lot',
	'cat-a-lot-watchlistpref'  : 'Watchlist preference concerning files edited with Cat-a-lot',
	'cat-a-lot-watch_pref'     : 'According to your general preferences',
	'cat-a-lot-watch_nochange' : 'Do not change watchstatus',
	'cat-a-lot-watch_watch'    : 'Watch pages edited with Cat-a-lot',
	'cat-a-lot-watch_unwatch'  : 'Remove pages while editing with Cat-a-lot from your watchlist',
	'cat-a-lot-minorpref'      : 'Mark edits as minor (if you generally mark your edits as minor, this won’t change anything)',
	'cat-a-lot-editpagespref'  : 'Allow categorising pages (including categories) that are not files',
	'cat-a-lot-docleanuppref'  : 'Remove {{Check categories}} and other minor cleanup',
	'cat-a-lot-uncatpref'      : 'Remove {{Uncategorized}}',
	'cat-a-lot-subcatcountpref': 'Sub-categories to show at most',
	'cat-a-lot-config-settings': 'Preferences',
	'cat-a-lot-buttonpref'     : 'Use buttons instead of text-links',
	'cat-a-lot-comment-label'  : 'Custom edit comment',
	'cat-a-lot-remember-size'  : 'Remember size',
	'cat-a-lot-remember-state' : 'Remember category',
	'cat-a-lot-session-timeout': 'How long in minutes Cat-a-lot remembers its state when "Remember category" is selected',

	// Progress
	'cat-a-lot-loading'          : 'Loading…',
	'cat-a-lot-editing'          : 'Editing page',
	'cat-a-lot-of'               : 'of ',
	'cat-a-lot-skipped-already'  : 'The following {{PLURAL:$1|1=page was|$1 pages were}} skipped, because the page was already in the category:',
	'cat-a-lot-skipped-not-found': 'The following {{PLURAL:$1|1=page was|$1 pages were}} skipped, because the old category could not be found:',
	'cat-a-lot-skipped-server'   : 'The following {{PLURAL:$1|1=page|$1 pages}} couldn’t be changed, since there were problems connecting to the server:',
	'cat-a-lot-all-done'         : 'All pages are processed.',
	'cat-a-lot-done'             : 'Done!',
	'cat-a-lot-added-cat'        : 'Added category $1',
	'cat-a-lot-copied-cat'       : 'Copied to category $1',
	'cat-a-lot-moved-cat'        : 'Moved to category $1',
	'cat-a-lot-removed-cat'      : 'Removed from category $1',
	// 'cat-a-lot-return-to-page': 'Return to page',
	// 'cat-a-lot-cat-not-found' : 'Category not found.',

	// as in 17 files selected
	'cat-a-lot-files-selected'   : '{{PLURAL:$1|1=One file|$1 files}} selected.',
	'cat-a-lot-pe_file'          : '$1 {{PLURAL:$1|page|pages}} of $2 affected',
	'cat-a-lot-parent-cat'       : 'Has parent-category: ',
	'cat-a-lot-sub-cat'          : 'Has sub-category: ',

	// Actions
	'cat-a-lot-copy'           : 'Copy',
	'cat-a-lot-move'           : 'Move',
	'cat-a-lot-add'            : 'Add',
	// 'cat-a-lot-remove-from-cat': 'Remove from this category',
	'cat-a-lot-overcat'        : 'Check over-categorization',
	'cat-a-lot-enter-name'     : 'Enter category name',
	'cat-a-lot-select'         : 'Select',
	'cat-a-lot-all'            : 'all',
	'cat-a-lot-none'           : 'none',
	// 'cat-a-lot-none-selected': 'No files selected!',
	'cat-a-lot-search'         : 'Search',

	// Summaries (project language):
	'cat-a-lot-pref-save-summary': 'Updating user preferences',
	'cat-a-lot-summary-add'      : 'Adding [[Category:$1]]',
	'cat-a-lot-summary-copy'     : 'Copying from [[Category:$1]] to [[Category:$2]]',
	'cat-a-lot-summary-move'     : 'Moving from [[Category:$1]] to [[Category:$2]]',
	'cat-a-lot-summary-remove'   : 'Removing from [[Category:$1]]',
	'cat-a-lot-prefix-summary'   : '', // Some text to prepend to the edit summary. Set this to an empty string if you use 'using'.
	'cat-a-lot-using-summary'    : ' using [[c:Help:Cat-a-lot|Cat-a-lot]]', // Some text to append to the edit summary. Set this to an empty string if you use 'prefix'.

	// Error dialog:
	'cat-a-lot-error-title'  : 'Error occurred while editing',
	'cat-a-lot-error'        : 'An error occurred while editing $1',
	'cat-a-lot-ignore-error' : 'Ignore and continue',
	'cat-a-lot-stop-editing' : 'Stop all editing',
	
	//Self-categorization:
	'cat-a-lot-skip-self-cat-confirm': 'Skipping self-categorization: "$1" will not be copied or moved to itself. Proceed with other pages?',
	'cat-a-lot-no-valid-cats-after-filter': 'No valid categories to copy or move after filtering self-categorization.',
};
mw.messages.set( msgs );

function msg( /* params */ ) {
	var args = Array.prototype.slice.call( arguments, 0 );
	args[ 0 ] = 'cat-a-lot-' + args[ 0 ];
	return ( args.length === 1 ) ?
		mw.message( args[ 0 ] ).plain() :
		mw.message.apply( mw.message, args ).parse();
}

// There is only one Cat-a-lot on one page
var $body, $container, $dataContainer, $searchInputContainer, $searchInput, $resultList, $markCounter, $selections,
	$selectFiles, $selectPages, $selectNone, $selectInvert, $settingsWrapper, $settingsLink, $head, $link, $overcat, $minmax, 
	$lockCheckbox, $lockStateCheckbox, $lockControl,
	commonsURL = 'https://commons.wikimedia.org/w/index.php',
	is_rtl = $( 'body' ).hasClass( 'rtl' ),
	reCat, // localized category search regexp
	non,
	r; // result file count for overcat

var CAL = mw.libs.catALot = {
	apiUrl: mw.util.wikiScript( 'api' ),
	origin: '',
	searchmode: false,
	version: '4.77',
	changeTag: 'Cat-a-lot',
	maxSimultaneousReq: 2,
	_commonsSourceAdded: false,

	settings: {
	/* Any category in this category is deemed a disambiguation category; i.e., a category that should not contain
any items, but that contains links to other categories where stuff should be categorized. If you don't have
that concept on your wiki, set it to null. Use blanks, not underscores. */
		disambig_category: 'Disambiguation categories', // Commons
		/* Any category in this category is deemed a (soft) redirect to some other category defined by a link
* to another non-blacklisted category. If your wiki doesn't have soft category redirects, set this to null.
* If a soft-redirected category contains more than one link to another non-blacklisted category, it's considered
* a disambiguation category instead. */
		redir_category: 'Category redirects',
		session_timeout: 60 // default is 60 minutes

	},

	init: function () {
		// Prevent historical double marker (maybe remove in future)
		if ( /Cat-?a-?lot/i.test( msgs[ 'cat-a-lot-pref-save-summary' ] ) ) { mw.messages.set( { 'cat-a-lot-prefix-summary': '', 'cat-a-lot-using-summary': '' } ); } else {
			mw.messages.set( {
				'cat-a-lot-pref-save-summary': msgs[ 'cat-a-lot-prefix-summary' ] + msgs[ 'cat-a-lot-pref-save-summary' ] + msgs[ 'cat-a-lot-using-summary' ]
			} );
		}

		// TODO: better extern project support for possible change-tag? (needs currently change after init)
		if ( project === 'commonswiki' ) { mw.messages.set( { 'cat-a-lot-using-summary': '' } ); } else { // Reset
			if ( project !== 'rowiki' ) {
				this.changeTag = '';
			}
			this.settings.redir_category = '';
		}

		this._initSettings();
		$body = $( document.body );
		$container = $( '<div>' )
			.attr( 'id', 'cat_a_lot' )
			.appendTo( $body );
		$dataContainer = $( '<div>' )
			.attr( 'id', 'cat_a_lot_data' )
			.appendTo( $container );
		$searchInputContainer = $( '<form>' )
			.attr( 'id', 'cat_a_lot_search_input_container' )
			.appendTo( $dataContainer );
		$searchInput = $( '<input>', {
			id: 'cat_a_lot_searchcatname',
			placeholder: msg( 'enter-name' ),
			type: 'text'
		} )
			.appendTo( $searchInputContainer );
		// $searchButton =
		$('<button>', {
			type: 'submit',
			text: msg('search'),
			id: 'cat_a_lot_search_button'
		})
			.appendTo($searchInputContainer);	
		$resultList = $( '<div>' )
			.attr( 'id', 'cat_a_lot_category_list' )
			.appendTo( $dataContainer );
		$markCounter = $( '<div>' )
			.attr( 'id', 'cat_a_lot_mark_counter' )
			.appendTo( $dataContainer );
		$selections = $( '<div>' )
			.attr( 'id', 'cat_a_lot_selections' )
			.text( msg( 'select' ) + ':' )
			.appendTo( $dataContainer );
		$settingsWrapper = $( '<div>' )
			.attr( 'id', 'cat_a_lot_settings' )
			.appendTo( $dataContainer );
		$settingsLink = $( '<a>', {
			id: 'cat_a_lot_config_settings',
			title: 'Version ' + this.version,
			text: msg( 'config-settings' )
		} )
			.appendTo( $settingsWrapper );
		$head = $( '<div>' )
			.attr( 'id', 'cat_a_lot_head' )
			.appendTo( $container );
		$link = $( '<a>' )
			.attr( 'id', 'cat_a_lot_toggle' )
			.text( msg( 'label' ) )
			.appendTo( $head );
		$minmax = $( '<a>' )
			.text( '–' )
			.attr( 'id', 'cat_a_lot_minmax' )
			.css( { fontWeight: 'bold', marginLeft: '.7em' } )
			.hide()
			.click(this.minmax_handler);
		$link.after($minmax);
		$settingsWrapper.append( $( '<a>', {
			href: commonsURL + '?title=Special:MyLanguage/Help:Gadget-Cat-a-lot',
			target: '_blank',
			style: 'float:right',
			title: ( $( '#n-help a' ).attr( 'title' ) || '' ) + ' (v. ' + this.version + ')'
		} ).text( $( '#mw-indicator-mw-helplink a' ).text() || '?' ) );
		$container.one( 'mouseover', function () { // Try load on demand earliest as possible
			mw.loader.load( [ 'jquery.ui'] );
		} );

		if ( this.origin && !non ) {
			$overcat = $( '<a>' )
				.attr( 'id', 'cat_a_lot_overcat' )
				.html( msg( 'overcat' ) )
				.on( 'click', function ( e ) {
					CAL.getOverCat( e );
				} )
				.insertBefore( $selections );
		}

		if ( ( mw.util.getParamValue( 'withJS' ) === 'MediaWiki:Gadget-Cat-a-lot.js' &&
			!mw.util.getParamValue( 'withCSS' ) ) ||
			mw.loader.getState( 'ext.gadget.Cat-a-lot' ) === 'registered' ) {
			mw.loader.load( mw.config.get( 'wgServer' ) + '/w/index.php?title=MediaWiki:Gadget-Cat-a-lot.css&action=raw&ctype=text/css', 'text/css' );
			// importStylesheet( 'MediaWiki:Gadget-Cat-a-lot.css' );
		}

		// Loading MediaWiki:Gadget-libAPI using mw.loader.load() so libAPI will work in other wikis too
		mw.loader.using( [ 'mediawiki.util','mediawiki.user','user.options' ], function () {
			mw.loader.load( '//commons.wikimedia.org/w/index.php?title=MediaWiki:Gadget-libAPI.js&action=raw&ctype=text/javascript' );
		});
		
		reCat = new RegExp( '^\\s*' + CAL.localizedRegex( 14, 'Category' ) + ':', '' );

		$searchInput.on( 'input keyup', function () {
				var oldVal = this.value,
					newVal = oldVal.replace( reCat, '' );
				if ( newVal !== oldVal ) { this.value = newVal; }

				if ( !newVal ) { sessionStorage.removeItem('catAlot_searchkey'); }
			} );
		$searchInputContainer.on('submit', function(e) {
			e.preventDefault();
			var category = $.trim($searchInput.val().replace(/[\u200E\u200F\u202A-\u202E]/g, ''));
			// restore the trailing space to sortkey that was lost during trim
			if ($searchInput.val().match(/\| +$/))
				category = category + " ";
				
			// If category ends with "|" (no characters after it), remove the trailing "|"
			if (category.match(/\|$/)) {
			    category = category.slice(0, -1);
			}
			CAL.updateCats(category);
			sessionStorage.setItem('catAlot_lastCategory', CAL.currentCategory);
			sessionStorage.setItem('catAlot_searchkey', CAL.currentCategory);
		});

		function initAutocomplete() {
			if ( CAL.autoCompleteIsEnabled ) { return; }

			CAL.autoCompleteIsEnabled = true;

			if ( !$searchInput.val() ) {
				const searchkey = sessionStorage.getItem('catAlot_searchkey');
				if (searchkey) { 
					$searchInput.val( searchkey ); 
				}
			}

			$searchInput.autocomplete( {
				source: function ( request, response ) {
                    // Left side trim and remove LTR-RTR characters
					var cleanKey = request.term.replace(
						/[\u200E\u200F\u202A-\u202E]/g,
						''
					).replace(
						/^\s+/,
						''
					);

					// Normalize whitespaces   
					cleanKey = cleanKey.replace(
						/[\t _\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g,
						' '
					);
	
					CAL.doAPICall( {
						action: 'opensearch',
						search: cleanKey,
						redirects: 'resolve',
						namespace: 14
					}, function ( data ) {
						if ( data[ 1 ] ) {
							response( $( data[ 1 ] )
								.map( function ( index, item ) {
									return item.replace( reCat, '' );
								} ) );
						}

					} );
				},
				open: function () {
					$( '.ui-autocomplete' )
						.position( {
							my: is_rtl ? 'left bottom' : 'right bottom',
							at: is_rtl ? 'left top' : 'right top',
							of: $searchInput
						} );
				},
				appendTo: '#cat_a_lot'
			} );
		}
		$( '<a>' )
		// .attr( 'id', 'cat_a_lot_select_all' )
			.text( msg( 'all' ) )
			.on( 'click', function () {
				CAL.toggleAll( true );
			} )
			.appendTo( $selections.append( ' ' ) );
		if ( this.settings.editpages ) {
			$selectFiles = $( '<a>' )
				.on( 'click', function () {
					CAL.toggleAll( 'files' );
				} );
			$selectPages = $( '<a>' )
				.on( 'click', function () {
					CAL.toggleAll( 'pages' );
				} );
			$selections.append( $( '<span>' ).hide().append( [ ' / ', $selectFiles, ' / ', $selectPages ] ) );
		}
		$selectNone = $( '<a>' )
		// .attr( 'id', 'cat_a_lot_select_none' )
			.text( msg( 'none' ) )
			.on( 'click', function () {
				CAL.toggleAll( false );
			} );
		$selectInvert = $( '<a>' )
			.on( 'click', function () {
				CAL.toggleAll( null );
			} );
		$selections.append( [ ' • ', $selectNone, ' • ', $selectInvert,
			$( '<div>' ).append( [
				$( '<input>' )
					.attr( {
						id: 'cat_a_lot_comment',
						type: 'text',
						placeholder: msg( 'comment-label' )
					} )
			] )
		] );

		$link
			.on( 'click', function () {
				$( this ).toggleClass( 'cat_a_lot_enabled' );
				// Load autocomplete on demand
				mw.loader.using( 'jquery.ui', initAutocomplete );

				if ( !CAL.executed ) {
					$.when( mw.loader.using( [
						'jquery.ui',
						'jquery.ui',
						'jquery.ui',
						'mediawiki.api',
						'mediawiki.jqueryMsg'
					] ), $.ready )
						.then( function () {
							return new mw.Api().loadMessagesIfMissing( [
								'Cancel',
								'Categorytree-not-found',
								// 'Checkuser-all',
								// 'Code-field-select',
								// 'Export-addcat',
								'Filerevert-submit',
								'Returnto',
								'Ooui-selectfile-placeholder',
								// 'Visualeditor-clipboard-copy',
								'Prefs-files',
								'Categories',
								'Checkbox-invert',
								'Centralnotice-remove', // 'Ooui-item-remove'
								'Apifeatureusage-warnings'
							] );
						} ).then( function () {
							CAL.run();
						} );
				} else { CAL.run(); }
			} );
		$settingsLink
			.on( 'click', CAL.manageSettings );
		this.localCatName = formattedNS[ 14 ] + ':';
		// Default state for remembering positon
		var lockPos = localStorage.getItem('catAlot_lockPosition') === 'true';
		if (!lockPos) {
			localStorage.removeItem('catAlot_position');
		}

		// Bottom bar checkbox
		$lockControl = $('<span>')
			.attr('id','cat_a_lot_lockcontrol')
			.css({ 'margin-left': '.7em', 'font-size': '.9em; float:right' })
			.appendTo($head);
		$lockCheckbox = $('<input>', {
				type: 'checkbox',
				id: 'cat_a_lot_lockpos'
			})
			.prop('checked', lockPos)
			.appendTo($lockControl);
		$('<label>', { for: 'cat_a_lot_lockpos' })
			.css('padding-left', '0.5em')
			.text( msg('remember-size') )
			.appendTo($lockControl);
		$lockControl.hide();
		// Save the state
		$lockCheckbox.on('change', function () {
			if (this.checked) {
				localStorage.setItem('catAlot_lockPosition', 'true');
				var off = $container.offset();
				localStorage.setItem('catAlot_position', JSON.stringify({
					top: off.top,
					left: off.left,
					width: $container.outerWidth(),
					height: $container.outerHeight()
				}));
			} else {
				localStorage.removeItem('catAlot_lockPosition');
				localStorage.removeItem('catAlot_position');
			}
		});
		
		var lockState = localStorage.getItem('catAlot_lockState') === 'true';
		$lockStateCheckbox = $('<input>', {
				type: 'checkbox',
				id: 'cat_a_lot_lockstate'
			})
			.css('margin-left', '0.5em')
			.prop('checked', lockState)
			.appendTo($lockControl);
		$('<label>', { for: 'cat_a_lot_lockstate' })
			.css('padding-left', '0.5em')
			.text( msg('remember-state') )
			.appendTo($lockControl);
		// Save the state
		$lockStateCheckbox.on('change', function () {
			if (this.checked) {
				localStorage.setItem('catAlot_lockState', 'true');
				sessionStorage.setItem('catAlot_lastCategory', CAL.currentCategory);
			} else {
				localStorage.removeItem('catAlot_lockState');
				sessionStorage.removeItem('catAlot_lastCategory');
			}
		});

		if (this.shouldReopenAutomatically()) {
			this.restorePosition();
			$link.click(); // auto-open Cat-a-lot
		}
	},
	
	shouldReopenAutomatically: function () {
		if (localStorage.getItem('catAlot_uiState') !== 'open') return false;
		if (mw.config.get( "wgAction" ) === "edit") return false;
		
		try {
			var last = parseInt(localStorage.getItem('catAlot_lastOpen') || '0', 10);
			var now = Date.now();
			
			// if last is invalid or in the future, don’t auto-reopen			
			if (!Number.isFinite(last) || last <= 0 || last > now) return false;
			
			// default session timeout: 60 mins in minutes, unless provided
			var timeout = Number(this.settings && this.settings.session_timeout) * 60 * 1000;
			if (!Number.isFinite(timeout) || timeout <= 0) timeout = 60 * 60 * 1000;
			
			// If expired then cleanup and don’t auto-reopen
			if ((now - last) > timeout) {
				localStorage.removeItem('catAlot_lastOpen');
				localStorage.removeItem('catAlot_lastNs');
				sessionStorage.removeItem('catAlot_lastPageName');
				return false;
			}
			var lastns = Number(localStorage.getItem('catAlot_lastNs'));
			var lastPageName = sessionStorage.getItem('catAlot_lastPageName');
			
			var specialPageName=mw.config.get( 'wgCanonicalSpecialPageName' );
			var specialPages = ['Listfiles', 'Search', 'MediaSearch', 'Uncategorizedimages'];
			
			if (!(specialPages.includes(specialPageName) 
				|| ns === 14 
				|| lastPageName === specialPageName 
				|| (lastns === ns && ns !== -1) 
			)) {
			   return false;
			}

		} catch (e) {
			console.log(e);
			return false;
		}
		return true;
	},

	
	restorePosition: function (){
		if ($('#cat_a_lot_lockpos').is(':checked')) {
			var saved = localStorage.getItem('catAlot_position');
			if (saved) {
				var pos = JSON.parse(saved);
				if ((pos.top + pos.height) > window.innerHeight) {
					pos.windowHeight = window.innerHeight;
					console.log('restorePosition() failed ' +
							'because the Cat-a-lot dialog is outside of the browser window. ' +
							JSON.stringify(pos)
							);
					return;
				}
				$container.css({
					top: pos.top,
					left: pos.left,
					right: 0,
					bottom: 0,
					position: 'fixed',
					'max-height': '100vh'
				});
			}
		}
	},

	_registerCommonsGadgetModules: function ( modules, errorCallback ) {
		var source = 'commonswiki',
			version = 'cat_a_lot_' + CAL.version.replace( /[^A-Za-z0-9_]/g, '_' ),
			moduleConfig = {
				'ext.gadget.libJQuery': [],
				'ext.gadget.SettingsUI': [
					'jquery.ui',
					'mediawiki.user',
					'ext.gadget.libJQuery'
				],
				'ext.gadget.SettingsManager': [
					'mediawiki.user',
					'user.options',
					'mediawiki.api',
					'mediawiki.util'
				]
			};
		
		function isRegisterableMissing( moduleName ) {
			// if module is not in config then it cannot be loaded 
			if (moduleConfig[ moduleName ] === undefined) {
				return false;
			}
			
			// check if module is already known to module loader
			return mw.loader.getState( moduleName ) === null;
		}

		function ensureCommonsSource () {
			if ( CAL._commonsSourceAdded ) {
				return;
			}
		
			try {
				mw.loader.addSource( {
					commonswiki: 'https://commons.wikimedia.org/w/load.php'
				} );
			} catch ( e ) {
				// Another script may already have registered this foreign source.
				if ( !/source already registered/i.test( String( e && e.message || e ) ) ) {
					throw e;
				}
			}
		
			CAL._commonsSourceAdded = true;
		}

		try {
			if ( modules.some( isRegisterableMissing ) ) {
				ensureCommonsSource();
			}
		
			modules.forEach( function ( moduleName ) {
				if ( isRegisterableMissing( moduleName ) ) {
					mw.loader.register(
						moduleName,
						version,
						moduleConfig[ moduleName ],
						null,
						source
					);
				}
			} );
		}
		catch ( e ) {
			if ( typeof errorCallback === 'function' ) {
				errorCallback( e );
				return false;
			}
			throw e;
		}
		return true;
	},
	
	getOverCat: function ( e ) {
		var files = [];
		r = 0; // result counter
		if ( e ) {
			e.preventDefault();
			this.files = this.getMarkedLabels(); // .toArray() not working
			for ( var f = 0; f < this.files.length; f++ ) { files.push( this.files[ f ] ); }

		}
		if ( !files.length || !( files instanceof Array ) ) { return alert( mw.msg( 'Ooui-selectfile-placeholder' ) ); }
		this.files = files;
		mw.loader.using( [ 'jquery.spinner' ], function () {
			$markCounter.injectSpinner( 'overcat' );
			CAL.getFileCats();
		} );
	},

	getFileCats: function () {
		var aLen = this.files.length;
		var bLen = this.selectedLabels.length;
		var file = this.files[ aLen - 1 ][ 0 ];
		$overcat.text( '…' + aLen + '\/' + bLen );
		if ( file ) {
			this.doAPICall( {
				prop: 'categories',
				titles: file
			}, this.checkFileCats
			);
		}

	},

	checkFileCats: function ( data ) {
		var cc = 0; // current cat counter;
		var file = CAL.files.pop();
		if ( data.query && data.query.pages ) {
			$.each( data.query.pages, function ( id, page ) {
				if ( page.categories ) {
					var target = file[ 1 ].removeClass( 'cat_a_lot_selected' );
					$.each( page.categories, function ( c, cat ) {
						var title = cat.title.replace( reCat, '' ),
							color = 'orange',
							mark = function ( kind ) { // kind of category
							// TODO: store data to use this for special remove function
								if ( kind === 'sub' ) { color = 'green'; }
								var border = '3px dotted ';
								if ( $.inArray( title, CAL[ kind + 'Cats' ] ) !== -1 ) {
									cc++;
									target = target.parents( '.gallerybox' );
									target = target[ 0 ] ? target : file[ 1 ];
									target.css( {
										border: border + color
									} ).prop( 'title', msg( kind + '-cat' ) + title );
									color = 'red';
									return false;
								}
							};
						mark( 'sub' );
						return mark( 'parent' );
					} );
					if ( cc ) { r++; }
				}
			} );
		} else { mw.log( 'Api-fail', file, data ); }
		if ( CAL.files[ 0 ] ) { return setTimeout( function () { CAL.getFileCats(); }, 100 ); } // Api has bad performance here, so we can get only each file separately
		$overcat.text( msg( 'pe_file', r, CAL.selectedLabels.length ) );
		$.removeSpinner( 'overcat' );
	},

	findAllLabels: function ( searchmode ) {
	// It's possible to allow any kind of pages as well but what happens if you click on "select all" and don't expect it
		switch ( searchmode ) {
			case 'search':
				if ( this.settings.editpages ) { this.labels = this.labels.add( $( 'li.mw-search-result' ) ); }
				else { this.labels = this.labels.add( $( '.searchResultImage .searchResultImage-text' ) ); }
				break;
			case 'mediasearch':
				// Note: mediasearch only shows files in the results.
				this.labels = this.labels.add($('section.cdx-tab:visible .sdms-image-result, section.cdx-tab:visible .sdms-audio-result, section.cdx-tab:visible .sdms-video-result, section.cdx-tab:visible .sdms-other-result, section.cdx-tab:visible .sdms-page-result'));
				break;				
			case 'category':
				this.findAllLabels( 'gallery' );
				this.labels = this.labels.add( $( '#mw-category-media' ).find( 'li[class!="gallerybox"]' ) );
				if ( this.settings.editpages ) {
					this.pageLabels = $( '#mw-pages, #mw-subcategories' ).find( 'li' );
					// this.files = this.labels;
					this.labels = this.labels.add( this.pageLabels );
				}
				break;
			case 'contribs':
				this.labels = this.labels.add( $( 'ul.mw-contributions-list li' ) );
				// FIXME: Filter if !this.settings.editpages
				break;
			case 'prefix':
				this.labels = this.labels.add( $( 'ul.mw-prefixindex-list li' ) );
				break;
			case 'listfiles':
			// this.labels = this.labels.add( $( 'table.listfiles>tbody>tr' ).find( 'td:eq(1)' ) );
				this.labels = this.labels.add( $( '.TablePager_col_img_name' ) );
				break;
			case 'gallery':
			// this.labels = this.labels.add( '.gallerybox' ); // TODO incombatible with GalleryDetails
				this.labels = this.labels.add( '.gallerytext' );
				break;
		}
	},

	getTitleFromLink: function ( $a ) {
		try {
			return decodeURIComponent( $a.attr( 'href' ) )
				.match( /wiki\/(.+?)(?:#.+)?$/ )[ 1 ].replace( /_/g, ' ' );
		// eslint-disable-next-line no-unused-vars
		} catch ( ex ) {
			return '';
		}
	},

	/**
 * Validates and normalizes a MediaWiki title
 * @param {string} title - The title to validate
 * @param {boolean} isGalleryFile - Whether this is for gallery file context
 * @returns {string|null} - Normalized title or null if invalid
 */

	getValidatedTitle : function ( title, isGalleryFile ) {
		if (!title) { 
			return null; 
		}
		
		try {
			var title_obj = mw.Title.newFromText(title);
			if (!title_obj) {
				return null; // Handle null return from newFromText
			}

			// If title doesn't have namespace in gallery  
			// then it is probably free text description and not page
			if (title_obj.getNamespaceId() == 0 && isGalleryFile) {
				return null;
			}
		
			// Return normalized title
			return title_obj.toString();
		// eslint-disable-next-line no-unused-vars
		} catch (e) {
			return null; // Handle invalid title exceptions
		}	
	},

	/**
	 *  @brief Get title from selected pages
	 *  @return [array] touple of page title and $object
	 */
	// this function is used in [[MediaWiki:Gadget-ACDC.js]], please avoid making incompatible changes ☺
	getMarkedLabels: function () {
		this.selectedLabels = this.labels.filter( '.cat_a_lot_selected:visible' );
		return this.selectedLabels.map( function () {
			var label = $(this);
			var file = null;
			var isGalleryFile = false;

			// Handle gallery tags
			if (label.hasClass('gallerytext')) {
				var gallerybox = label.closest('.gallerybox');
				
				if (gallerybox.length) {
					file = gallerybox.find('.thumb').find('a[title]').first();
				}
				isGalleryFile = true;
			} else {
				// Original behavior (default)
				file = label.find('a:not([role])[title][class$="title"]');
				file = file.length ? file : label.find('a:not([role])[title]');
			}
			// In Special:MediaSearch page code adds .cat_a_lot_selected 
			// CSS class directly to the label 
			if (!file.length && label.is('[title]')) {
				file = label;
			}
			
			// First pass, try to get the filename from title
			// Title can be also free text if it is defined in wikitext
			
			var title = CAL.getValidatedTitle(file.attr( 'title' ), isGalleryFile);

			// Second pass, try if we can get the filename from url
			if (!title) {
				title = CAL.getTitleFromLink( file ) ||
					CAL.getTitleFromLink( label.find( 'a:not([role])' ) ) ||
					CAL.getTitleFromLink( label.parent().find( 'a:not([role])' ) ); // TODO needs optimization
				title = CAL.getValidatedTitle(title, isGalleryFile);
			}
			
			if (title) {
				return [ [ title, label ] ];
			}
			return null;
		} );
	},

	// Display a warning if the user tries to leave the page when there are selections.
	setPageUnloadWarning: function(showUnloadWarning) {
		// Clear previous beforeunload handler
		$( window ).off( 'beforeunload.cat_a_lot' );
	
		if ( showUnloadWarning ) {
			// Add the confirmation prompt only if selections exist
			$( window ).on( 'beforeunload.cat_a_lot', function ( e ) {
				e.preventDefault();
				e.returnValue = true; // Legacy support
			});
		}
	},

	updateSelectionCounter: function () {
		this.selectedLabels = this.labels.filter( '.cat_a_lot_selected:visible' );
		$markCounter
			.html( msg( 'files-selected', this.selectedLabels.length ) )
			.show();
		CAL.setPageUnloadWarning(this.selectedLabels.length);
	},
	
	observeTabChange: function() {
		var container = document.querySelector( ".cdx-tabs__content");
		if ( this.tabsObserver ) {
			this.tabsObserver.disconnect();
		}
		this.tabsObserver = new MutationObserver( function() {
			CAL.makeClickable();
		} );
		
		// Start observing the container for attribute changes in its children
		if ( container ) {
			var tabContents = container.children;
			for ( var i = 0; i < tabContents.length; i++ ) {
				this.tabsObserver.observe( tabContents[i], { attributes: true, attributeFilter: ['style'] } );
			}
		}
	},

	observeNewMediaSearchResults: function () {
		var CAL = this; // Reference to Cat-a-lot object
	
		// Select the container where new results are added
		var container = $('section.cdx-tab:visible .sdms-search-results__list' ).get(0);
	
		// If observer already exists, disconnect it first
		if ( this.resultsObserver ) {
			this.resultsObserver.disconnect();
		}
	
		// Create a new MutationObserver
		this.resultsObserver = new MutationObserver( function( mutationsList ) {
			for ( var mutation of mutationsList ) {
				if ( mutation.type === 'childList' && mutation.addedNodes.length > 0 ) {
					// Call makeClickable() to re-initialize labels
					CAL.makeClickable();
					break; // No need to process further mutations
				}
			}
		} );
	
		// Start observing the container for child additions
		if ( container ) {
			this.resultsObserver.observe(container, { childList: true, subtree: false });
		}
	},
	
	initMediaSearchEventHandlers : function() {
		this.interceptedElements = $(); // Initialize an array to keep track
		this.labels.each( function () {
			var $this = $( this );
			var element = $this.get( 0 );
			var handler = function ( event ) {
				event.stopPropagation();
				// Proceed with Cat-a-lot selection logic
				$this.trigger( 'click.catALot', event );
			};
			// Store the handler so we can remove it later
			$this.data( 'cal_click_handler', handler );
			element.addEventListener( 'click', handler, true ); // Capture phase
			// Keep track of elements we modified
			CAL.interceptedElements = CAL.interceptedElements.add( $this );
		});
		
		// Call the function to set up the observer
		// Delay is to be sure that Vue.js update is ready before observing
		setTimeout( function() {
			CAL.observeNewMediaSearchResults();
		}, 300 );
		this.updateSelectionCounter();
	},
	
	clearMediaSearchEventHandlers: function() {
		if ( this.interceptedElements ) {
			this.interceptedElements.each( function() {
				var $this = $( this );
				var element = $this.get( 0 );
				var handler = $this.data( 'cal_click_handler' );
				if (handler) {
					element.removeEventListener( 'click', handler, true );
					$this.removeData( 'cal_click_handler' );
				}
			});
			this.interceptedElements = null;
		}
	},

	makeClickable: function () {
		
		// Unbind old event handlers
		if (this.labels) {
			this.labels.off('click.catALot');
		}

		// Remove old intercepted event handlers
		if ( this.searchmode === 'mediasearch' ) {
			this.clearMediaSearchEventHandlers();
		}
		
		// Clear old labels
		$( '.cat_a_lot_label' ).removeClass( 'cat_a_lot_label' );
		
		this.labels = $();
		this.pageLabels = $(); // only for distinct all selections
		this.findAllLabels( this.searchmode );
		CAL.updateOldSelections(); // Move old selections to new labels
		
		// Apply event handlers to labels
		this.labels.catALotShiftClick( function () {
			CAL.updateSelectionCounter();
		} )
		.addClass( 'cat_a_lot_label' );

		// For MediaSearch, intercept Vue.js event handlers
		if ( this.searchmode === 'mediasearch' ) {
			this.initMediaSearchEventHandlers();
		}
		
		// Show selection counter if least one is selected
		if ( $( '.cat_a_lot_selected' ).length ) {
			this.updateSelectionCounter();
		}			
	},

	// Move old selections to new labels. This is needed in Special:Search
	updateOldSelections : function () {
		this.labels.each( function() {
			var current = $( this );
			
			// Move child element selections to current
			var selected_childs = current.find( '.cat_a_lot_selected, #cat_a_lot_last_selected' );
			if ( selected_childs.length > 0 ) {
				selected_childs.removeClass( 'cat_a_lot_selected' );
				selected_childs.removeAttr( 'id' );
				current.addClass( 'cat_a_lot_selected' );
			}
			
			// Move parent element selections to current
			var parents = current.parents( '.cat_a_lot_selected' );
			if ( parents.length ) {
				parents.removeClass( 'cat_a_lot_selected' );
				current.addClass( 'cat_a_lot_selected' );
			}
			var selected_parents = current.parents( '#cat_a_lot_last_selected' );
			if ( selected_parents.length ) {
				selected_parents.removeAttr( 'id' );
				current.attr( 'id', 'cat_a_lot_last_selected' );
			}
		});
		
		// Remove selected which cannot be selected in current settings
		$( ".cat_a_lot_selected" ).not( this.labels )
			.removeClass( 'cat_a_lot_selected' )
			.removeClass( 'cat_a_lot_last_selected' );
	},

	// promises are used to confirm that updateSelectionCounter is 
	// called after toggleClass is ready
	toggleAll: function ( select ) {
		let togglePromises = [];
	
		if ( typeof select === 'string' && this.pageLabels[0] ) {
			togglePromises.push( this.pageLabels.toggleClass( 'cat_a_lot_selected', true ) );
			if ( select === 'files' ) {
				togglePromises.push( this.labels.toggleClass( 'cat_a_lot_selected' ) );
			}
		} else {
			// invert / none / all
			togglePromises.push( this.labels.toggleClass( 'cat_a_lot_selected', select ) );
		}
	
		$.when( ...togglePromises ).done( () => {
			this.updateSelectionCounter();
		} );
	},

	getSubCats: function () {
		var data = {
			list: 'categorymembers',
			cmtype: 'subcat',
			cmlimit: this.settings.subcatcount,
			cmtitle: 'Category:' + this.currentCategory
		};

		this.doAPICall( data, function ( result ) {
			var cats = ( result && result.query && result.query.categorymembers ) || [];
			CAL.subCats = [];
			for ( var i = 0; i < cats.length; i++ ) { CAL.subCats.push( cats[ i ].title.replace( /^[^:]+:/, '' ) ); }

			CAL.catCounter++;
			if ( CAL.catCounter === 2 ) { CAL.showCategoryList(); }

		} );
	},

	getParentCats: function () {
		var data = {
			prop: 'categories',
			titles: 'Category:' + this.currentCategory
		};
		this.doAPICall( data, function ( result ) {
			if(!result) return;
			CAL.parentCats = [];
			var cats,
				pages = result.query.pages,
				table = $( '<table>' );

			if ( pages[ -1 ] && pages[ -1 ].missing === '' ) {
				$resultList.html( '<span id="cat_a_lot_no_found">' + mw.msg( 'Categorytree-not-found', this.currentCategory ) + '</span>' );
				document.body.style.cursor = 'auto';
				CAL.createCatLinks( '→', [ CAL.currentCategory ], table );
				$resultList.append( table );
				return;
			}
			// there should be only one, but we don't know its ID
			for ( var id in pages ) { cats = pages[ id ].categories || []; }

			for ( var i = 0; i < cats.length; i++ ) { CAL.parentCats.push( cats[ i ].title.replace( /^[^:]+:/, '' ) ); }

			CAL.catCounter++;
			if ( CAL.catCounter === 2 ) { CAL.showCategoryList(); }

		} );
	},

	localizedRegex: function ( namespaceNumber, fallback ) {
	// Copied from HotCat, thanks Lupo.
		var wikiTextBlank = '[\\t _\\xA0\\u1680\\u180E\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000]+';
		var wikiTextBlankRE = new RegExp( wikiTextBlank, 'g' );
		var createRegexStr = function ( name ) {
			if ( !name || !name.length ) { return ''; }

			var regexName = '';
			for ( var i = 0; i < name.length; i++ ) {
				var ii = name[ i ];
				var ll = ii.toLowerCase();
				var ul = ii.toUpperCase();
				regexName += ( ll === ul ) ? ii : '[' + ll + ul + ']';
			}
			return regexName.replace( /([\\\^\$\.\?\*\+\(\)])/g, '\\$1' )
				.replace( wikiTextBlankRE, wikiTextBlank );
		};

		fallback = fallback.toLowerCase();
		var canonical = formattedNS[ namespaceNumber ].toLowerCase();
		var RegexString = createRegexStr( canonical );
		if ( fallback && canonical !== fallback ) { RegexString += '|' + createRegexStr( fallback ); }

		for ( var catName in nsIDs ) { if ( typeof catName === 'string' && catName.toLowerCase() !== canonical && catName.toLowerCase() !== fallback && nsIDs[ catName ] === namespaceNumber ) { RegexString += '|' + createRegexStr( catName ); } }

		return ( '(?:' + RegexString + ')' );
	},

	regexCatBuilder: function ( category ) {
		var catname = this.localizedRegex( 14, 'Category' );

		// Build a regexp string for matching the given category:
		// trim leading/trailing whitespace and underscores
		category = category.replace( /^[\s_]+|[\s_]+$/g, '' );

		// escape regexp metacharacters (= any ASCII punctuation except _)
		category = mw.util.escapeRegExp( category );

		// any sequence of spaces and underscores should match any other
		category = category.replace( /[\s_]+/g, '[\\s_]+' );

		// Make the first character case-insensitive:
		var first = category.substr( 0, 1 );
		if ( first.toUpperCase() !== first.toLowerCase() ) { category = '[' + first.toUpperCase() + first.toLowerCase() + ']' + category.substr( 1 ); }

		// Compile it into a RegExp that matches MediaWiki category syntax (yeah, it looks ugly):
		// XXX: the first capturing parens are assumed to match the sortkey, if present, including the | but excluding the ]]
		return new RegExp( '\\[\\[[\\s_]*' + catname + '[\\s_]*:[\\s_]*' + category + '[\\s_]*(\\|[^\\]]*(?:\\][^\\]]+)*)?\\]\\]\\s*', 'g' );
	},

	getContent: function ( page, targetcat, mode ) {
		if ( !this.cancelled ) {
			this.doAPICall( {
				curtimestamp: 1,
				// meta: 'tokens',
				prop: 'revisions',
				rvprop: 'content|timestamp|contentmodel',
				rvslots: 'main',
				titles: page[ 0 ]
			}, function ( result ) {
				CAL.editCategories( result, page, targetcat, mode );
			} );
		}

	},

	getTargetCat: function ( pages, targetcat, mode ) {
		if ( !this.cancelled ) {
			const timer = ms => new Promise(res => setTimeout(res, ms));
			this.doAPICall( {
				meta: 'tokens',
				prop: 'categories|categoryinfo',
				titles: 'Category:' + targetcat
			}, function ( result ) {
				if ( !result || !result.query ) { return; }
				CAL.edittoken = result.query.tokens.csrftoken;
				result = CAL._getPageQuery( result );
				CAL.checkTargetCat( result );
				let promise = Promise.resolve();
				for ( let i = 0; i < pages.length; i++ ) {
					// NOTE: This timer is here to keep edits
					// in same order than in screen.
					promise = promise.then( () => timer( 40 ) ).then( () => {
						CAL.getContent( pages[ i ], targetcat, mode );
					} );
				}
			} );
		}
	},

	checkTargetCat: function ( page ) {
		var is_dab = false; // disambiguation
		var is_redir = typeof page.redirect === 'string'; // Hard redirect?
		if ( typeof page.missing === 'string' ) { return alert( mw.msg( 'Apifeatureusage-warnings', mw.msg( 'Categorytree-not-found', page.title ) ) ); }
		var cats = page.categories;
		this.is_hidden = page.categoryinfo && typeof page.categoryinfo.hidden === 'string';

		if ( !is_redir && cats && ( CAL.disambig_category || CAL.redir_category ) ) {
			for ( var c = 0; c < cats.length; c++ ) {
				var cat = cats[ c ].title;
				if ( cat ) { // Strip namespace prefix
					cat = cat.substring( cat.indexOf( ':' ) + 1 ).replace( /_/g, ' ' );
					if ( cat === CAL.disambig_category ) {
						is_dab = true; break;
					} else if ( cat === CAL.redir_category ) {
						is_redir = true; break;
					}
				}
			}
		}

		if ( !is_redir && !is_dab ) { return; }
		alert( mw.msg( 'Apifeatureusage-warnings', page.title + ' is a ' + CAL.disambig_category ) );
	},

	// Remove {{Uncategorized}} (also with comment). No need to replace it with anything.
	removeUncat: function ( text ) {
		return ( this.settings.uncat ? text.replace( /\{\{\s*[Uu]ncategorized\s*[^}]*\}\}\s*(<!--.*?-->\s*)?/, '' ) : text );
	},

	doCleanup: function ( text ) {
		return ( this.settings.docleanup ? text.replace( /\{\{\s*[Cc]heck categories\s*(\|?.*?)\}\}/, '' ) : text );
	},

	editCategories: function ( result, file, targetcat, mode ) {
		var page_title = file[ 0 ];
		var page_element = file[ 1 ]; // selected item as jquery object
		
		if ( !result || !result.query ) {
		// Happens on unstable wifi connections..
			this.connectionError.push( page_title );
			this.updateCounter();
			return;
		}
		var otext,
			timestamp,
			contentmodel,
			newtext,
			page = CAL._getPageQuery( result );
		if ( !page || page.ns === 2 ) { 
			this.connectionError.push( page_title );
			this.updateCounter();			
			return; 
		}
		var id = page && page.revisions && page.revisions[ 0 ];

		if (!id) {
			this.connectionError.push( page_title );
			this.updateCounter();
			return;
		}
		this.starttimestamp = result.curtimestamp;
		otext = id.slots.main[ '*' ];
		timestamp = id.timestamp;
		contentmodel=id.slots.main.contentmodel;

		const jsonContentModels = ['Tabular.JsonConfig', 'Map.JsonConfig', 'Chart.JsonConfig'];
		if (jsonContentModels.includes(contentmodel)) {
			// Get namespace of the page being edited from the API result
			const pageNs = page.ns;

			// Check if the page being edited is in Data namespace (486)
			if (pageNs !== 486) {
				console.error('Error: JSON content model detected but page is not in Data namespace (486)');
				this.connectionError.push(page_title);
				this.updateCounter();
				return;
			}

			newtext = this.editJsonCategories(page_title, otext, targetcat, mode);
		} else {
			newtext = this.editWikitextCategories(page_title, otext, targetcat, mode);
		}
		
		// If result was 'nochange' or 'error', then newtext is false.
		// Errors are already handled in editJsonCategories/editWikitextCategories.
		if ( !newtext ) return;
		
		var data = {
			action: 'edit',
			assert: 'user',
			summary: newtext.summary,
			title: page_title,
			text: newtext.text,
			bot: true,
			contentmodel: contentmodel,
			starttimestamp: this.starttimestamp,
			basetimestamp: timestamp,
			watchlist: this.settings.watchlist,
			tags: this.changeTag,
			token: this.edittoken
		};
		if ( this.settings.minor ) {
			// boolean parameters are quirky, see
			// https://commons.wikimedia.org/w/api.php?action=help&modules=main#main/datatype/boolean
			data.minor = true;
		}

		this.doAPICall( data, function ( r ) {
			delete CAL.XHR[ page_title ];
			CAL.markAsDone( page_element, newtext.mode, newtext.targetcat );
			CAL.updateUndoCounter( r );
		},
		function ( error ) {
			CAL.showErrorDialog(data.title, error);
		} );
	},

	editJsonCategories: function( page_title, otext, targetcat, mode ) {
		// Parse JSON content
		try {
			var jsonData = JSON.parse(otext);
		} catch (e) {
			console.error('Failed to parse JSON:', e);
			this.connectionError.push(page_title);
			this.updateCounter();
			return;
		}

		// Initialize mediawikiCategories if missing
		// Note: No structural validation - server handles that during save
		if (!jsonData.mediawikiCategories) {
			jsonData.mediawikiCategories = [];
		}

		function normalizeCategory(cat) {
			if (!cat) return { name: '', sort: undefined }; 

			// Convert string category to object
			if (typeof cat === 'string') {
				const firstPipeCharacter = cat.indexOf('|');
				if (firstPipeCharacter !== -1) {
					cat = {
						name: cat.substring(0, firstPipeCharacter),
						sort: cat.substring(firstPipeCharacter+1)
					};
				}
				else {
					cat = {
						name: cat,
						sort: undefined
					};
				}
			}
			
			// Prepare base normalized category
			var normalized = {
				name: new mw.Title(cat.name || '', 14).getMainText()
			};

			// Include sortkey if it is "" or "somevalue"
			if (typeof cat.sort  === 'string') {
				normalized.sort = cat.sort;
			}
			return normalized;
		}
		
		function computeSortKey(sourceCat, normalizedTarget) {
			if (typeof normalizedTarget.sort === 'string') return normalizedTarget.sort;
			if (typeof sourceCat.sort === 'string') return sourceCat.sort;
			return undefined;
		}

		// Initialize mediawikiCategories if missing
		// Note: No structural validation - server handles that during save
		if (!jsonData.mediawikiCategories) {
			jsonData.mediawikiCategories = [];
		}
		else {
			// Convert all entries to proper objects
			jsonData.mediawikiCategories = jsonData.mediawikiCategories.map( c => 
				normalizeCategory( c )
			);			
		}

		var normalizedTarget = normalizeCategory( targetcat );
		var normalizedOrigin = normalizeCategory( this.origin );
		// var originalCategories = [ ...jsonData.mediawikiCategories ];
		var changed = false;
		var summary = '';
		
		var targetIndex = jsonData.mediawikiCategories.findIndex(existingCat => 
			existingCat.name === normalizedTarget.name
		);
		
		var newCat = { name: normalizedTarget.name };

		// Handle different operations
		switch ( mode ) {
			case 'add':
				// Check if category already exists with same name (ignore sort key for comparison)
				if (jsonData.mediawikiCategories.some( existingCat => 
					existingCat.name === normalizedTarget.name && 
					existingCat.sort === normalizedTarget.sort
					)) {
					this.alreadyThere.push( page_title );
					this.updateCounter();
					return;
				}

				// For Data namespace, ensure we're adding a proper object
				jsonData.mediawikiCategories.push( normalizedTarget );
				changed = true;
				summary = msg( 'summary-add' ).replace( /\$1/g, normalizedTarget.name );
				break;

			case 'remove':
				// Remove by matching name (sort key doesn't matter for removal)
				var initialLength = jsonData.mediawikiCategories.length;

				  jsonData.mediawikiCategories = jsonData.mediawikiCategories.filter(cat => {
					if (cat.name !== normalizedTarget.name) return true;
					// user provided a sort: only drop if sorts match
					return normalizedTarget.sort !== undefined && cat.sort !== normalizedTarget.sort;
				});
				changed = jsonData.mediawikiCategories.length !== initialLength;
 
				if ( !changed ) {
					this.notFound.push( page_title );
					this.updateCounter();
					return;
				}
				summary = msg( 'summary-remove' ).replace( /\$1/g, targetcat );
				break;

			case 'copy':
				var sourceCat = jsonData.mediawikiCategories.find(existingCat => 
					existingCat.name === normalizedOrigin.name
				);
				
				// Check if targetCat exists so that the functionality
				// remains consistent with the editWikitextCategories()  
				if (!sourceCat) {
					this.notFound.push(page_title);
					this.updateCounter();
					return;
				}
				
				newCat.sort = computeSortKey(sourceCat, normalizedTarget);
				
				if (targetIndex ===-1) {
					// Add new category
					jsonData.mediawikiCategories.push(newCat);
				} else {
					var existingCat = jsonData.mediawikiCategories[targetIndex];
					// If new cat is identical to old cat then no changes
					if (existingCat.sort === newCat.sort) {
						this.alreadyThere.push(page_title);
						this.updateCounter();
						return;						
					}
					jsonData.mediawikiCategories[targetIndex] = newCat;
				}
				changed = true;
				summary = msg('summary-copy').replace(/\$1/g, normalizedOrigin.name).replace(/\$2/g, targetcat);
				break;

			case 'move':
				summary = msg('summary-move').replace(/\$1/g, this.origin).replace(/\$2/g, targetcat);
				var sourceIndex = jsonData.mediawikiCategories.findIndex(existingCat => 
					existingCat.name === normalizedOrigin.name
				);
				sourceCat = jsonData.mediawikiCategories[sourceIndex];
				
				// Test that source category exists
				if (sourceIndex === -1) {
					this.notFound.push(page_title);
					this.updateCounter();
					return;
				}

				newCat.sort = computeSortKey(sourceCat, normalizedTarget);
				
				if (sourceIndex === targetIndex) {
					
					// if source and target are same then do not edit the page
					if (sourceCat.sort === newCat.sort) {
						this.alreadyThere.push(page_title);
						this.updateCounter();
						return;
					}
					// Same category, just update sort key
					jsonData.mediawikiCategories[sourceIndex] = newCat;
				} else if (targetIndex === -1) {
					// Target doesn't exist, replace source
					jsonData.mediawikiCategories[sourceIndex] = newCat;
				} else {
					// If targetcat already existed with identical sortkey then change mode to "remove"
					var oldTargetCat = jsonData.mediawikiCategories[targetIndex];
					var removeOnly = (oldTargetCat.name === newCat.name && oldTargetCat.sort  === newCat.sort);
					if (removeOnly) {
						summary = msg('summary-remove').replace(/\$1/g, normalizedOrigin.name);
						targetcat = normalizedOrigin.name;
						mode ='remove';
					}
					// Update target cat if sortkey differs
					jsonData.mediawikiCategories[targetIndex] = newCat;
					// and remove the sourcecat
					jsonData.mediawikiCategories.splice(sourceIndex, 1);
				}
				
				changed = true;
				break;

			default:
				console.error( 'Unknown operation mode:', mode );
				this.connectionError.push( page_title );
				this.updateCounter();
				return;
		}

		if ( !changed ) {
			this.notFound.push( page_title );
			this.updateCounter();
			return;
		}

		return {
			summary: summary,
			text: JSON.stringify( jsonData, null, 2 ),
			mode: mode,
			targetcat: targetcat
		};
	},

	editWikitextCategories: function( page_title, otext, targetcat, mode ) {
		var sourcecat = this.origin;
		var catNS = this.localCatName; // canonical cat-name
		
		// Check if that file is already in that category
		if ( mode !== 'remove' && this.regexCatBuilder( targetcat ).test( otext ) ) {
			// If the new cat is already there, just remove the old one
			if ( mode === 'move' ) {
				mode = 'remove';
				targetcat = sourcecat;
			} else {
				this.alreadyThere.push( page_title );
				this.updateCounter();
				return;
			}
		}

		// Text modification (following 3 functions are partialy taken from HotCat)
		var wikiTextBlankOrBidi = '[\\t _\\xA0\\u1680\\u180E\\u2000-\\u200B\\u200E\\u200F\\u2028-\\u202F\\u205F\\u3000]*';
		// Whitespace regexp for handling whitespace between link components. Including the horizontal tab, but not \n\r\f\v:
		// a link must be on one single line.
		// MediaWiki also removes Unicode bidi override characters in page titles (and namespace names) completely.
		// This is *not* handled, as it would require us to allow any of [\u200E\u200F\u202A-\u202E] between any two
		// characters inside a category link. It _could_ be done though... We _do_ handle strange spaces, including the
		// zero-width space \u200B, and bidi overrides between the components of a category link (adjacent to the colon,
		// or adjacent to and inside of "[[" and "]]").
		var findCatsRE = new RegExp( '\\[\\[' + wikiTextBlankOrBidi + this.localizedRegex( 14, 'Category' ) + wikiTextBlankOrBidi + ':[^\\]]+\\]\\]', 'g' );

		function replaceByBlanks( match ) {
			return match.replace( /(\s|\S)/g, ' ' ); // /./ doesn't match linebreaks. /(\s|\S)/ does.
		}

		function find_insertionpoint( wikitext ) {
			var copiedtext = wikitext
				.replace( /<!--(\s|\S)*?-->/g, replaceByBlanks )
				.replace( /<nowiki>(\s|\S)*?<\/nowiki>/g, replaceByBlanks );
			// Search in copiedtext to avoid that we insert inside an HTML comment or a nowiki "element".
			var index = -1;
			findCatsRE.lastIndex = 0;
			while ( findCatsRE.exec( copiedtext ) !== null ) { index = findCatsRE.lastIndex; }

			return index;
		}

		/**
*  @brief Adds the new Category by searching the right insert point,
*		 if there is text after the category section
*  @param [string] wikitext
*  @param [string] toAdd
*  @return Return wikitext
*/
		function addCategory( wikitext, toAdd ) {
			if ( toAdd && toAdd[ 0 ] ) {
			// TODO: support sort key
				var cat_point = find_insertionpoint( wikitext ); // Position of last category
				var newcatstring = '[[' + catNS + toAdd + ']]';
				if ( cat_point > -1 ) {
					var suffix = wikitext.substring( cat_point );
					wikitext = wikitext.substring( 0, cat_point ) + ( cat_point ? '\n' : '' ) + newcatstring;
					if ( suffix[ 0 ] && suffix.substr( 0, 1 ) !== '\n' ) { wikitext += '\n'; }
					wikitext += suffix;
				} else {
					if ( wikitext[ 0 ] && wikitext.substr( wikitext.length - 1, 1 ) !== '\n' ) { wikitext += '\n'; }

					wikitext += ( wikitext[ 0 ] ? '\n' : '' ) + newcatstring;
				}
			}
			return wikitext;
		}
		// End HotCat functions
		
		// Splits targetcat to categoryname and sortkey
		function splitTargetCat(targetcat) {
			const i = targetcat.indexOf('|');
			var ret = i === -1
				? { name: targetcat, sort: '$1' } // $1 = use sortkey from source cat
    			: { name: targetcat.slice(0, i), sort: targetcat.slice(i) }; // keep leading '|'
    		// 'targetcat|' will expand as [[category:targetcat|targetcat]] so clear the empty sortkey	
    		if (ret.sort === '|') {
    			ret.sort = '';
    		}
    		return ret;
		}

		var newcat = splitTargetCat(targetcat);
		var text = otext,
			arr = is_rtl ? '\u2190' : '\u2192', // left and right arrows. Don't use ← and → in the code.
			sumCmt, // summary comment
			sumCmtShort;
		// Fix text
		switch ( mode ) {
			case 'add':
				text = addCategory( text, targetcat );
				sumCmt = msg( 'summary-add' ).replace( /\$1/g, targetcat );
				sumCmtShort = '+[[' + catNS + targetcat + ']]';
				break;
			case 'copy':
				// Skip if category exists in the article with different sortkey
				// If the preferred way to handle this is to update the sortkey, then 
				// this code should be changed from skip to update
				if ( this.regexCatBuilder( newcat.name ).test( otext ) ) {
					this.alreadyThere.push( page_title );
					this.updateCounter();
					return;				
				}
				var wikitextcopycat = '[[' + catNS + sourcecat + '$1]]\n[[' + catNS + newcat.name + newcat.sort +']]\n';
				text = text.replace( this.regexCatBuilder( sourcecat ), wikitextcopycat );
				sumCmt = msg( 'summary-copy' ).replace( /\$1/g, sourcecat ).replace( /\$2/g, newcat.name );
				sumCmtShort = '+[[' + catNS + sourcecat + ']]' + arr + '[[' + catNS + newcat.name + ']]';
				// If category is added through template:
				if ( otext === text ) { text = addCategory( text, targetcat ); }

				break;
			case 'move':
				var wikitextmovecat = '[[' + catNS + newcat.name + newcat.sort +']]\n';
				text = text.replace( this.regexCatBuilder( sourcecat ), wikitextmovecat );
				sumCmt = msg( 'summary-move' ).replace( /\$1/g, sourcecat ).replace( /\$2/g, newcat.name  );
				sumCmtShort = '±[[' + catNS + sourcecat + ']]' + arr + '[[' + catNS + newcat.name  + ']]';
				break;
			case 'remove':
				text = text.replace( this.regexCatBuilder( targetcat ), '' );
				sumCmt = msg( 'summary-remove' ).replace( /\$1/g, targetcat );
				sumCmtShort = '-[[' + catNS + targetcat + ']]';
				break;
		}

		if ( text === otext ) {
			this.notFound.push( page_title );
			this.updateCounter();
			return;
		}
		otext = text;

		// Remove {{uncat}} after we checked whether we changed the text successfully.
		// Otherwise we might fail to do the changes, but still replace {{uncat}}
		if ( mode !== 'remove' && ( !non || userGrp.indexOf( 'autoconfirmed' ) > -1 ) ) {
			if ( !this.is_hidden ) {
				text = this.removeUncat( text );
				if ( text.length !== otext.length ) { sumCmt += '; ' + msg( 'uncatpref' ); }
			}
			text = this.doCleanup( text );
		}

		sumCmt += this.summary ? ' ' + this.summary : '';

		var preM = msg( 'prefix-summary' );
		var usgM = msg( 'using-summary' );
		// Try shorten summary
		if ( preM || usgM )	{
			sumCmt = ( sumCmt.length > 250 - preM.length - usgM.length ) ?
				sumCmt + ' (CatAlot)' : preM + sumCmt + usgM;
		}

		if ( sumCmt.length > 254 ) // Try short summary
		{ sumCmt = sumCmtShort; }
		
		return { summary: sumCmt, text: text, mode: mode, targetcat: targetcat };
	},

	markAsDone: function ( label, mode, targetcat ) {
		mode = ( function ( m ) {
			switch ( m ) {
				case 'add': return 'added-cat';
				case 'copy': return 'copied-cat';
				case 'move': return 'moved-cat';
				case 'remove': return 'removed-cat';
			}
		}( mode ) );
		label.addClass( 'cat_a_lot_markAsDone' ).append( '<br>' + msg( mode, targetcat ) );
	},

	updateUndoCounter: function ( r ) {
		this.updateCounter();
		if ( !r.edit || r.edit.result !== 'Success' ) { return; }
		r = r.edit;

		this.undoList.push( {
			title: r.title,
			id: r.newrevid,
			timestamp: r.newtimestamp
		} );
	},

	updateCounter: function () {
		this.counterCurrent++;
		if ( this.counterCurrent > this.counterNeeded ) { this.displayResult(); } else { this.domCounter.text( this.counterCurrent ); }
	},

	displayResult: function () {
		function createListContainer(items, threshold) {
			threshold = threshold || 15;
			var content = items.map((item) => mw.html.escape(String(item))).join( '<br>' );
			if ( items.length > threshold ) {
				return '<div class="cat_a_lot_display_result_list" >' + content + '</div>';
			}
			return content;
		}
		
		document.body.style.cursor = 'auto';
		$.removeSpinner( 'fb-dialog' );
		this.progressDialog.parent()
			.addClass( 'cat_a_lot_done' )
			.find( '.ui-dialog-buttonpane button span' ).eq( 0 )
			.text( mw.msg( 'Returnto', this.localCatName + mw.config.get( 'wgTitle' ) ) );
		var rep = this.domCounter.parent()
			.html( '<h3>' + msg( 'done' ) + '</h3>' )
			.append( msg( 'all-done' ) + '<br>' );
		if ( this.alreadyThere.length ) {
			
			rep.append( '<h5>' + msg( 'skipped-already', this.alreadyThere.length ) + '</h5>' )
				.append( createListContainer( this.alreadyThere ) );
		}

		if ( this.notFound.length ) {
			rep.append( '<h5>' + msg( 'skipped-not-found', this.notFound.length ) + '</h5>' )
				.append( createListContainer( this.notFound ) );
		}

		if ( this.connectionError.length ) {
			rep.append( '<h5>' + msg( 'skipped-server', this.connectionError.length ) + '</h5>' )
				.append( createListContainer( this.connectionError ) );
		}
		
		// center the dialog
		this.progressDialog.dialog("widget").position({ my: "center", at: "center", of: window });
	},

	showErrorDialog: function(fileName, error) {
		// Create error notification dialog
		$('<div>')
			.html('<p>' + mw.message('cat-a-lot-error', fileName).parse() + '</p>' +
				'<p class="error-details">' + mw.html.escape(error) + '</p>' +
				'<div class="error-actions">' +
				'</div>')
			.dialog({
				modal: true,
				title: mw.msg('cat-a-lot-error-title'),
				width: 400,
				dialogClass: 'cat-a-lot-error-dialog',
				closeOnEscape: false,
				open: function() {
					// Remove the close button
					$(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').remove();
				},
				buttons: [
					{
						text: mw.msg('cat-a-lot-ignore-error'),
						click: function() {
							$(this).dialog('close');
							// Continue with next file
							CAL.connectionError.push(fileName);
							CAL.updateCounter();
							mw.libs.commons.api.continueEditing();
						}
					},
					{
						text: mw.msg('cat-a-lot-stop-editing'),
						click: function() {
							$(this).dialog('close');
							// Abort all pending operations
							CAL.doAbort();
							// Clear any remaining operations
							CAL.cancelled = 1;
							// Update UI to show operation stopped
							CAL.progressDialog.remove();
							CAL.toggleAll(false);
							$head.last().show();
							// Show final results
							CAL.displayResult();
						}
					}
				]
			});
	},

	/**
*  @brief set parameters for API call,
*  	convert targetcat to string, get selected pages/files
*  @param [dom object] targetcat with data
*  @param [string] mode action
*  @return Return API call getTargetCat with pages
*/
	doSomething: function ( targetcat, mode ) {
		var pages = this.getMarkedLabels();
		if ( !pages.length ) { return alert( mw.msg( 'Ooui-selectfile-placeholder' ) ); }
		targetcat = $( targetcat ).closest( 'tr' ).data( 'cat' );

		// Get filtered pages and self-categorizing pages
		var result = this.filterPages(pages, targetcat, mode);
		var filteredPages = result.filteredPages;
		var selfCatPages = result.selfCatPages;

		// Show self-categorization notification dialog
		if ( selfCatPages.length > 0 ) {
			if ( filteredPages.length === 0 ) {
				// Only self-categorizing pages - just show alert
				alert( msg( 'no-valid-cats-after-filter' ) );
				return;
			} else {
				// Mixed case - show confirm
				var proceed = confirm( mw.message( 'cat-a-lot-skip-self-cat-confirm', targetcat ).plain() );
				if ( !proceed ) {
					return;
				}
			}
		}

		this.notFound = [];
		this.alreadyThere = [];
		this.connectionError = [];
		this.counterCurrent = 1;
		this.counterNeeded = filteredPages.length;
		this.undoList = [];
		this.XHR = {};
		this.cancelled = 0;
		this.summary = '';
		
		// Just to make the UI feel snappier when there is no need to wait 
		// for updateMaxLag to dynamically tune maxSimultaneousReq up/down
		mw.libs.commons.api.config.maxSimultaneousReq = CAL.maxSimultaneousReq;
		mw.libs.commons.api.config.pauseOnError = true;

		if ( $( '#cat_a_lot_comment' )[0].value != '' ) { this.summary = $( '#cat_a_lot_comment' )[0].value; } // TODO custom pre-value
		if ( this.summary !== null ) {
			mw.loader.using( [ 'jquery.ui', 'jquery.spinner', 'mediawiki.util' ], function () {
				CAL.updateMaxLag();
				CAL.showProgress();
				CAL.getTargetCat( filteredPages, targetcat, mode );
			} );
		}
	},

	/**
	 * Filters out self-categorizing pages and returns both filtered and self-categorizing pages
	 * @param pages Array of selected pages
	 * @param targetcat Target category name
	 * @param mode Operation mode ('add', 'remove', etc.)
	 * @return Object with filteredPages and selfCatPages arrays
	 */
	filterPages: function ( pages, targetcat, mode ) {
		var filteredPages = [];
		var selfCatPages = [];

		for ( var i = 0; i < pages.length; i++ ) {
			var page = pages[i];
			var selectedcat = page[0];

			// Skip check for removals
			if ( mode === 'remove' ) {
				filteredPages.push( page );
				continue;
			}

			// Skip check if target category has a sortkey, 
			// as self-categorization is used for updating sortkeys.
			if ( targetcat.indexOf("|") !== -1  ) {
				filteredPages.push( page );
				continue;
			}	

			if ( selectedcat && targetcat ) {
				var normalizedSelected = new mw.Title( selectedcat ).toString();
				var normalizedTarget = mw.Title.makeTitle( 14, targetcat ).toString();

				if ( normalizedSelected === normalizedTarget ) {
					selfCatPages.push( page );
					continue;
				}
			}
			filteredPages.push( page );
		}
		return {
			filteredPages: filteredPages,
			selfCatPages: selfCatPages
		};
	},

	// Set maxSimultaneousReq value based on maxlag
	// default mw.libs.commons.api.config.maxSimultaneousReq = 1
	updateMaxLag: function() {
		$.ajax( {
			url: this.apiUrl,
			dataType: 'json',
			cache: false,
			data: {
				action: 'query',
				format: 'json',
				titles: 'Main Page',
				maxlag: -1 // Set maxlag to -1 to get the current lag
			},
			success: function ( response ) {
				if ( response.error && response.error.code === 'maxlag' ) {
					var lag = parseFloat( response.error.lag );
					if ( lag > 1.5 ) {
						mw.libs.commons.api.config.maxSimultaneousReq = 1;
					} else {
						mw.libs.commons.api.config.maxSimultaneousReq = CAL.maxSimultaneousReq;
					}
				}
				else
				{
					// Should not happen, you might want to set a safe default
					mw.libs.commons.api.config.maxSimultaneousReq = 1;
				}
			},
			error: function () {
				// On error, you might want to set a safe default
				mw.libs.commons.api.config.maxSimultaneousReq = 1;
			}
		} );
	},

	doAPICall: function ( params, callback, errorCallback ) {

		// Perform edits using mw.libs.commons.api, which
		// can manage concurrent edits.
		// https://commons.wikimedia.org/wiki/MediaWiki:Gadget-libAPI.js
		//
		// The maximum number of simultaneous edits is defined in
		// CAL.updateMaxLag() function
		
		if ( params.action === 'edit' && !CAL.cancelled ) {
			var editPageParams = {
				editType: 'text',
				title: params.title,
				text: params.text,
				bot: params.bot,
				basetimestamp: params.basetimestamp,
				starttimestamp: params.starttimestamp,
				summary: params.summary,
				watchlist: params.watchlist,
				nocreate: 1,
				tags: params.tags,
				cb: callback,
				errCb: errorCallback
			};
			
			mw.libs.commons.api.editPage( editPageParams );
			return;
		}

		params = $.extend( {
			action: 'query',
			format: 'json'
		}, params );

		var i = 0,
			self = this,
			apiUrl = this.apiUrl,
			doCall,
			handleError = function ( jqXHR, textStatus, errorThrown ) {
				mw.log( 'Error: ', jqXHR, textStatus, errorThrown );
				if ( i < 4 ) {
					window.setTimeout( doCall, 300 );
					i++;
				} else if ( params.title ) {
					self.connectionError.push( params.title );
					self.updateCounter();
					return;
				}
			};
		doCall = function () {
			var xhr = $.ajax( {
				url: apiUrl,
				cache: false,
				dataType: 'json',
				data: params,
				type: 'POST',
				success: callback,
				error: handleError
			} );

			if ( params.action === 'edit' && !CAL.cancelled ) { CAL.XHR[ params.title ] = xhr; }
		};
		doCall();
	},

	createCatLinks: function ( symbol, list, table ) {
		list.sort();
		var button = ( this.settings.button && mw.loader.getState( 'jquery.ui' ) === 'ready' ) ? 1 : 0;
		for ( var c = 0; c < list.length; c++ ) {
			var $tr = $( '<tr>' ),
				$link = $( '<a>', {
					href: mw.util.getUrl( CAL.localCatName + list[ c ] ),
					text: list[ c ]
				} ),
				$buttons = [];
			$tr.data( 'cat', list[ c ] );
			$link.on( 'click', function ( e ) {
				if ( !e.ctrlKey ) {
					e.preventDefault();
					const selectedCat = $( this ).closest( 'tr' ).data( 'cat' );
					CAL.updateCats( selectedCat );
					sessionStorage.setItem('catAlot_lastCategory', CAL.currentCategory);
				}
			} );

			$tr.append( $( '<td>' ).text( symbol ) )
				.append( 
					$( '<td>' )
					.addClass('cat_a_lot_category_list_categoryname_column')
					.append( $link )
					);

			$buttons.push( $( '<a>' )
				.text( mw.msg( 'Centralnotice-remove' ) )
				.on( 'click', function () {
					CAL.doSomething( this, 'remove' );
				} )
				.addClass( 'cat_a_lot_move' )
			);
			if ( button ) {
				$buttons.slice( -1 )[ 0 ].button( {
					icons: { primary: 'ui-icon-minusthick' },
					showLabel: false,
					text: false
				} );
			}

			if ( this.origin ) {
			// Can't move to source category
				if ( list[ c ] !== this.origin ) {
					$buttons.push( $( '<a>' )
						.text( msg( 'move' ) )
						.on( 'click', function () {
							CAL.doSomething( this, 'move' );
						} )
						.addClass( 'cat_a_lot_move' )
					);
					if ( button ) {
						$buttons.slice( -1 )[ 0 ].button( {
							icons: { primary: 'ui-icon-arrowthick-1-e' },
							showLabel: false,
							text: false
						} );
					}

					$buttons.push( $( '<a>' )
						.text( msg( 'copy' ) )
						.on( 'click', function () {
							CAL.doSomething( this, 'copy' );
						} )
						.addClass( 'cat_a_lot_action' )
					);
					if ( button ) {
						$buttons.slice( -1 )[ 0 ].button( {
							icons: { primary: 'ui-icon-plusthick' },
							showLabel: false,
							text: false
						} );
					}

				}
			} else {
				$buttons.push( $( '<a>' )
					.text( msg( 'add' ) )
					.on( 'click', function () {
						CAL.doSomething( this, 'add' );
					} )
					.addClass( 'cat_a_lot_action' )
				);
				if ( button ) {
					$buttons.slice( -1 )[ 0 ].button( {
						icons: { primary: 'ui-icon-plusthick' },
						showLabel: false,
						text: false
					} );
				}

			}
			// TODO CSS may extern
			var css = button ? { fontSize: '.6em', margin: '0', width: '2.5em' } : {};
			for ( var b = 0; b < $buttons.length; b++ ) { $tr.append( $( '<td>' ).append( $buttons[ b ].css( css ) ) ); }

			table.append( $tr );
		}
	},

	getCategoryList: function () {
		this.catCounter = 0;
		this.getParentCats();
		this.getSubCats();
	},

	_getPageQuery: function ( data ) {
	// There should be only one, but we don't know its ID
		if ( data && data.query && data.query.pages ) {
			data = data.query.pages;
			for ( var p in data ) { return data[ p ]; }
		}
	},

	/**
*  @brief takes this.currentCategory if redir_category is configured
** Cat pages with more than one cat link are still not supported for sure
*  @return soft redirected cat
*/
	solveSoftRedirect: function () {
		this.doAPICall( {
			prop: 'links', // TODO: For more accuracy the revisions could be checked
			titles: 'Category:' + this.currentCategory,
			// 'rvprop': 'content',
			// 'pllimit': 'max',
			plnamespace: 14
		}, function ( page ) {
			page = CAL._getPageQuery( page );
			if ( page ) {
				var lks = page.links;
				if ( lks && lks.length === 1 && lks[ 0 ].title ) {
					CAL.currentCategory = lks[ 0 ].title.replace( reCat, '' );
					$searchInput.val( CAL.currentCategory );
					return CAL.getCategoryList();
				} else {
				// TODO? better translatable warning message: "Please solve the category soft redirect manually!"
					$resultList.html( '<span id="cat_a_lot_no_found">' + mw.msg( 'Apifeatureusage-warnings', mw.msg( 'Categorytree-not-found', CAL.currentCategory ) ) + '</span>' );
				}
			}
		} );
	},

	showCategoryList: function () {
		if ( this.settings.redir_category && this.settings.redir_category === this.parentCats[ 0 ] ) { return this.solveSoftRedirect(); }

		var table = $( '<table>' );

		this.createCatLinks( '↑', this.parentCats, table );
		this.createCatLinks( '→', [ this.currentCategory ], table );
		// Show on soft-redirect
		if ( $searchInput.val() === this.currentCategory && this.origin !== this.currentCategory ) { this.createCatLinks( '→', [ this.origin ], table ); }
		this.createCatLinks( '↓', this.subCats, table );

		$resultList.empty();
		$resultList.append( table );

		document.body.style.cursor = 'auto';

		// Reset width
		table.width( '100%' );
	},

	updateCats: function ( newcat ) {
		document.body.style.cursor = 'wait';
		this.currentCategory = newcat;
		$resultList.html( '<div class="cat_a_lot_loading">' + mw.msg( 'cat-a-lot-loading' ) + '</div>' );
		this.getCategoryList();
	},

	doUndo: function () {
		this.cancelled = 0;
		this.doAbort();
		if ( !this.undoList.length ) { return; }

		$( '.cat_a_lot_feedback' ).removeClass( 'cat_a_lot_done' );
		this.counterNeeded = this.undoList.length;
		this.counterCurrent = 1;

		document.body.style.cursor = 'wait';

		var query = {
			action: 'edit',
			user: mw.config.get( 'wgUserName' ),
			bot: true,
			starttimestamp: this.starttimestamp,
			watchlist: this.settings.watchlist,
			tags: this.changeTag,
			token: this.edittoken
		};
		if ( this.settings.minor ) {
			// boolean parameters are quirky, see
			// https://commons.wikimedia.org/w/api.php?action=help&modules=main#main/datatype/boolean
			query.minor = true;
		}
		for ( var i = 0; i < this.undoList.length; i++ ) {
			var uID = this.undoList[ i ];
			query.title = uID.title;
			query.undo = uID.id;
			query.basetimestamp = uID.timestamp;
			this.doAPICall( query, function ( r ) {
			// TODO: Add "details" to progressbar?
			// $resultList.append( [mw.msg('Filerevert-submit') + " done " + r.edit.title, '<br>' ] );
				if ( r && r.edit ) { mw.log( 'Revert done', r.edit.title ); }
				CAL.updateCounter();
			} );
		}
	},

	doAbort: function () {
		for ( var t in this.XHR ) { this.XHR[ t ].abort(); }

		if ( this.cancelled ) { // still not for undo
			this.progressDialog.remove();
			this.toggleAll( false );
			$head.last().show();
			document.body.style.cursor = 'auto';
		}
		this.cancelled = 1;
		
		// If not ready, then send abort to mw.libs.commons.api
		if ( this.counterCurrent < this.counterNeeded ) {
			mw.libs.commons.api.abortPendingRequests();
		}
	},

	showProgress: function () {
		document.body.style.cursor = 'wait';
		this.progressDialog = $( '<div>' )
			.html( ' ' + msg( 'editing' ) + ' <span id="cat_a_lot_current">' + CAL.counterCurrent + '</span> ' + msg( 'of' ) + CAL.counterNeeded )
			.prepend( $.createSpinner( { id: 'fb-dialog', size: 'large' } ) )
			.dialog( {
				width: 'auto',
				maxWidth: '90vw',
				modal: true,
				resizable: true,
				draggable: false,
				// closeOnEscape: true,
				dialogClass: 'cat_a_lot_feedback',
				buttons: [ {
					text: mw.msg( 'Cancel' ), // Stops all actions
					click: function () {
						$( this ).dialog( 'close' );
					}
				} ],
				close: function () {
					CAL.cancelled = 1;
					CAL.doAbort();
					$( this ).remove();
				},
				open: function ( event, ui ) { // Workaround modify
					ui = $( this ).parent();
					ui.find( '.ui-dialog-titlebar' ).hide();
					ui.find( '.ui-dialog-buttonpane.ui-widget-content' )
						.removeClass( 'ui-widget-content' );
				/* .find( 'span' ).css( { fontSize: '90%' } )*/
				}
			} );
		if ( $head.children().length < 4 ) {
			$( '<span>' )
				.css( {
					'float': 'right',
					fontSize: '75%'
				} )
				.append( [ '[ ',
					$( '<a>', { title: 'Revert all last done edits' } ) // TODO i18n
						.on( 'click', function () {
							if ( window.confirm( mw.msg( 'Apifeatureusage-warnings', this.title + '⁉' ) ) ) {
								CAL.doUndo();
								$( this ).parent().remove();
							}
							return false;
						} )
						.addClass( 'new' )
						.text( mw.msg( 'Filerevert-submit' ) ),
					' ]'
				] ).insertAfter( $link );
		}

		this.domCounter = $( '#cat_a_lot_current' );
	},

	minmax_handler: function( e ) {
		if ($dataContainer.is(':visible')) {
			CAL.minimize(e);
		}
		else {
			CAL.maximize(e);
		}
	},

	minimize: function () {
		// Keep current container width when datacontainer is hidden
		$container.width( $container.width() );
		
		// Store current height and position for maximize
		CAL.height = $container.css('height');
		CAL.top = $container.css('top');
		
		// Hide and clear top and height so window will be lowered
		$dataContainer.hide();
		$lockControl.hide();
		$container.css('height', '');
		$container.css('top', '');
	},

	maximize: function () {
		// Restore container width back to automatic
		$container.width('auto');
		
		// Restore position and show window
		if (CAL.height) $container.css('height', CAL.height);
		if (CAL.top) $container.css('top', CAL.top);
		$dataContainer.show();
		$lockControl.show();
	},

	run: function () {
		if ( $( '.cat_a_lot_enabled' )[ 0 ] ) {
			$dataContainer.css({
					'display': 'flex',
					'flex': '1 1 auto',
					'min-height': '0',
					'overflow': 'hidden',
					'flex-direction': 'column'
					});
					
			this.restorePosition();			
			this.makeClickable();
			
			if ( this.searchmode === 'mediasearch' ) {
				setTimeout( function() {
					
					// rerun makeClickable() when Vue.js init
					// is stabilized
					CAL.makeClickable();
					
					// track Vue.js tab changes
					CAL.observeTabChange();
				}, 300 );
			}
			
			if ( !this.executed ) { // only once
				$selectInvert.text( mw.msg( 'Checkbox-invert' ) );
				if ( this.settings.editpages && this.pageLabels[ 0 ] ) {
					$selectFiles.text( mw.msg( 'Prefs-files' ) );
					$selectPages.text( mw.msg( 'Categories' ) ).parent().show();
				}
			}
			$dataContainer.show();
			$('#cat_a_lot_lockcontrol').show();
			$container.one( 'mouseover', function () {
				$( this )
					.resizable( {
						handles:  'n,w,nw',
						resize: function () {
						},
						start: function ( e, ui ) {
							// remove 65% height limit. 
							// For some reason removing value or setting it to auto
							// wont work. Setting it to 100vh is a workaround.
							$container.css('max-height','100vh');
							
							// Otherwise box get static if sametime resize with draggable
							ui.helper.css( {
								top: ui.helper.offset().top - $( window ).scrollTop(),
								position: 'fixed'
							} );
						},
						stop: function () {
							// Prevent container moving outside of window
							$container.css({
								right: 0,
								bottom: 0
							});
							
							if ($('#cat_a_lot_lockpos').is(':checked')) {
								
								var off = $container.offset();
								var pos = {
									top: off.top,
									left: off.left,
									width: $container.outerWidth(),
									height: $container.outerHeight()
								};
								
								if ((pos.top + pos.height) <= window.innerHeight) {
									localStorage.setItem('catAlot_position', JSON.stringify(pos));
								} else {
									pos.windowHeight = window.innerHeight;
									console.log( 'Skipping the saving of the window position ' +
											'because the Cat-a-lot dialog is outside of the browser window.' +
											JSON.stringify(pos)
											);
								}
							} 
						}
						} )
					.one( 'mousedown', function () {
					} );
			} );
			const lastCat = sessionStorage.getItem('catAlot_lastCategory');
			const lockState = localStorage.getItem('catAlot_lockState')==='true'; 
			if (lockState && lastCat && typeof lastCat === 'string' && lastCat.trim() !== '') {
				this.updateCats(lastCat);
			} else {
				this.updateCats( this.origin || 'Images' );
			}

			$link.html( $( '<span>' )
				.text( '×' )
				.css( { font: 'bold 2em monospace', lineHeight: '.75em' } )
			);
			$link.next().show();
			if ( this.cancelled ) { $head.last().show(); }
			localStorage.setItem('catAlot_uiState', 'open'); // Let stay open on new window
			localStorage.setItem('catAlot_lastOpen', Date.now());
			localStorage.setItem('catAlot_lastNs', ns);
			sessionStorage.setItem('catAlot_lastPageName', mw.config.get( 'wgCanonicalSpecialPageName' ));
			
		} else { // Reset
			$dataContainer.hide();
			$container
				.resizable( 'destroy' )
				.removeAttr( 'style' );
				
			// Unbind click handlers
			this.labels.off( 'click.catALot' );
			
			// Remove capturing event handlers
			if ( this.searchmode === 'mediasearch' ) {
				this.clearMediaSearchEventHandlers();
			}
		
			// Disconnect the MutationObserver
			if (this.resultsObserver) {
				this.resultsObserver.disconnect();
				this.resultsObserver = null;
			}
			
			if (this.tabsObserver) {
				this.tabsObserver.disconnect();
				this.tabsObserver = null;				
			}
			
			$link.text( 'Cat-a-lot' )
				.nextAll().hide();
			this.executed = 1;
			localStorage.removeItem('catAlot_uiState');
			localStorage.removeItem('catAlot_lastOpen');
			if (localStorage.getItem('catAlot_lockState')!=='true') {
				sessionStorage.removeItem('catAlot_lastCategory');
			}
			localStorage.removeItem('catAlot_lastNs');
			sessionStorage.removeItem('catAlot_lastPageName');
		}
	},

	manageSettings: function () {
		function handleError( e ) {
			var errorMessage = 'Cat-a-lot could not load the preferences dialog.';
			mw.log.error( errorMessage, e );	
			alert( errorMessage );			
		}
		
		var modules = [
			'ext.gadget.SettingsManager',
			'ext.gadget.SettingsUI',
			'ext.gadget.libJQuery',
			'jquery.ui'
		];
	
		if (CAL._registerCommonsGadgetModules( modules, handleError )) {
			mw.loader.using( modules, CAL._manageSettings, handleError );
		}
	},

	_manageSettings: function () {
		mw.libs.SettingsUI( CAL.defaults, 'Cat-a-lot' )
			.show()
			.done( function ( s, verbose, loc, settingsOut, $dlg ) {
				var mustRestart = false,
					_restart = function () {
						if ( !mustRestart ) { return; }
						$container.remove();
						CAL.labels.off( 'click.catALot' );
						CAL.init();
					},
					_saveToJS = function () {
						var opt = mw.libs.settingsManager.option( {
								optionName: 'catALotPrefs',
								value: CAL.settings,
								encloseSignature: 'catALot',
								encloseBlock: '////////// Cat-a-lot user preferences //////////\n',
								triggerSaveAt: /Cat.?A.?Lot/i,
								editSummary: msg( 'pref-save-summary' )
							} ),
							oldHeight = $dlg.height(),
							$prog = $( '<div>' );

						$dlg.css( 'height', oldHeight )
							.html( '' );
						$prog.css( {
							height: Math.round( oldHeight / 8 ),
							'margin-top': Math.round( ( 7 * oldHeight ) / 16 )
						} )
							.appendTo( $dlg );

						$dlg.parent()
							.find( '.ui-dialog-buttonpane button' )
							.button( 'option', 'disabled', true );

						opt.save()
							.done( function ( text, progress ) {
								$prog.progressbar( {
									value: progress
								} );
								$prog.fadeOut( function () {
									$dlg.dialog( 'close' );
									_restart();
								} );
							} )
							.progress( function ( text, progress ) {
								$prog.progressbar( {
									value: progress
								} );
							// TODO: Add "details" to progressbar
							} )
							.fail( function ( text ) {
								$prog.addClass( 'ui-state-error' );
								$dlg.prepend( $( '<p>' )
									.text( text ) );
							} );
					};
				$.each( settingsOut, function ( n, v ) {
					if ( v.forcerestart && CAL.settings[ v.name ] !== v.value ) { mustRestart = true; }
					CAL.settings[ v.name ] = CAL.catALotPrefs[ v.name ] = v.value;
				} );
				switch ( loc ) {
					case 'page':
						$dlg.dialog( 'close' );
						_restart();
						break;
					case 'account-publicly':
						_saveToJS();
						break;
				}
			} );
	},

	_initSettings: function () {
		if ( this.settings.watchlist ) { return; }
		this.catALotPrefs = window.catALotPrefs || {};
		for ( var i = 0; i < this.defaults.length; i++ ) {
			var v = this.defaults[ i ];
			v.value = this.settings[ v.name ] = ( this.catALotPrefs[ v.name ] === undefined ? v['default'] : this.catALotPrefs[ v.name ] );
			v.label = msg( v.label_i18n );
			if ( v.select_i18n ) {
				v.select = {};
				$.each( v.select_i18n, function ( i18nk, val ) {
					v.select[ msg( i18nk ) ] = val;
				} );
			}
		}
	},
	/* eslint-disable camelcase */
	defaults: [ {
		name: 'watchlist',
		'default': 'preferences',
		label_i18n: 'watchlistpref',
		select_i18n: {
			watch_pref: 'preferences',
			watch_nochange: 'nochange',
			watch_watch: 'watch',
			watch_unwatch: 'unwatch'
		}
	}, {
		name: 'minor',
		'default': false,
		label_i18n: 'minorpref'
	}, {
		name: 'editpages',
		'default': project !== 'commonswiki', // on Commons false
		label_i18n: 'editpagespref',
		forcerestart: true
	}, {
		name: 'docleanup',
		'default': false,
		label_i18n: 'docleanuppref'
	}, {
		name: 'subcatcount',
		'default': 50,
		min: 5,
		max: 500,
		label_i18n: 'subcatcountpref',
		forcerestart: true
	}, {
		name: 'uncat',
		'default': project === 'commonswiki', // on Commons true
		label_i18n: 'uncatpref'
	}, {
		name: 'button',
		'default': true,
		label_i18n: 'buttonpref'
	}, {
		name: 'session_timeout',
		'default': 60,
		min: 1,
		max: 99999,
		label_i18n: 'session-timeout',
	}
	]
/* eslint-enable camelcase */
};

// The gadget is not immediately needed, so let the page load normally
window.setTimeout( function () {
	non = mw.config.get( 'wgUserName' );
	if ( non ) {
		if ( mw.config.get( 'wgRelevantUserName' ) === non ) { non = 0; } else {
			$.each( [ 'sysop', 'filemover', 'editor', 'rollbacker', 'patroller', 'autopatrolled', 'image-reviewer', 'reviewer', 'extendedconfirmed' ], function ( i, v ) {
				non = $.inArray( v, userGrp ) === -1;
				return non;
			} );
		}
	} else { non = 1; }

	switch ( ns ) {
		case 14:
			CAL.searchmode = 'category';
			CAL.origin = mw.config.get( 'wgTitle' );
			break;
		case -1:
			CAL.searchmode = {
			// list of accepted special page names mapped to search mode names
				Contributions: 'contribs',
				Listfiles: non ? null : 'listfiles',
				Prefixindex: non ? null : 'prefix',
				Search: 'search',
				MediaSearch: 'mediasearch',
				Uncategorizedimages: 'gallery'
			}[ mw.config.get( 'wgCanonicalSpecialPageName' ) ];
			break;
		case 2:
		case 0:
			CAL.searchmode = 'gallery';
			var parents = $( '#mw-normal-catlinks ul' ).find( 'a[title]' ), n;
			parents.each( function ( i ) {
				if ( new RegExp( mw.config.get( 'wgTitle' ), 'i' ).test( $( this ).text() ) ) {
					n = i;
					return false;
				}
			} );
			CAL.origin = parents.eq( n || 0 ).text();
	}

	if ( CAL.searchmode ) {
		var loadingLocalizations = 1;
		var loadLocalization = function ( lang, cb ) {
			loadingLocalizations++;
			switch ( lang ) {
				case 'zh-hk':
				case 'zh-mo':
				case 'zh-tw':
					lang = 'zh-hant';
					break;
				case 'zh':
				case 'zh-cn':
				case 'zh-my':
				case 'zh-sg':
					lang = 'zh-hans';
					break;
			}

			$.ajax( {
				url: commonsURL,
				dataType: 'script',
				data: {
					title: 'MediaWiki:Gadget-Cat-a-lot.js/' + lang,
					action: 'raw',
					ctype: 'text/javascript',
					// Allow caching for 28 days
					maxage: 2419200,
					smaxage: 2419200
				},
				cache: true,
				success: cb,
				error: cb
			} );
		};
		var maybeLaunch = function () {
			loadingLocalizations--;
			function init() {
				$( function () {
					CAL.init();
				} );
			}
			if ( !loadingLocalizations ) { mw.loader.using( [ 'user' ], init, init ); }
		};

		var userlang = mw.config.get( 'wgUserLanguage' ),
			contlang = mw.config.get( 'wgContentLanguage' );
		if ( userlang !== 'en' ) { loadLocalization( userlang, maybeLaunch ); }
		if ( $.inArray( contlang, [ 'en', userlang ] ) === -1 ) { loadLocalization( contlang, maybeLaunch ); }
		maybeLaunch();
	}
}, 400 );

/**
 * When clicking a cat-a-lot label with Shift pressed, select all labels between the current and last-clicked one.
 */
$.fn.catALotShiftClick = function ( cb ) {
	var prevCheckbox = null,
		$box = this;

	// When our boxes are clicked...
	$box.on( 'click.catALot', function ( e, originalEvent ) {

		var event = originalEvent || e;

		// Allow opening the links in Special:Search
		if ( CAL.searchmode === 'search' ) {
			// Check if the clicked element is a link
			if ( $( event.target ).closest( 'a' ).length ) {
				// It's a link; allow default action (open the link)
				return;
			}
		}
		
		// Prevent default behavior and stop propagation
		if ( !event.ctrlKey ) {
			event.preventDefault();
			event.stopPropagation();
		}
		
		// Highlight last selected
		$( '#cat_a_lot_last_selected' ).removeAttr( 'id' );
		
		var $thisControl = $( event.target ), method;

		// Ensure we're working with the correct label
		if ( !$thisControl.hasClass( 'cat_a_lot_label' ) ) {
			$thisControl = $thisControl.closest( '.cat_a_lot_label' );
		}

		$thisControl.attr( 'id', 'cat_a_lot_last_selected' )
			.toggleClass( 'cat_a_lot_selected' );
			
		// If one has been clicked before and shift key is held...
		if ( prevCheckbox !== null && event.shiftKey ) {
			method = $thisControl.hasClass( 'cat_a_lot_selected' ) ? 'addClass' : 'removeClass';
			
			// Check or uncheck this one and all in-between checkboxes
			$box.slice(
				Math.min( $box.index( prevCheckbox ), $box.index( $thisControl ) ),
				Math.max( $box.index( prevCheckbox ), $box.index( $thisControl ) ) + 1
			)[ method ]( 'cat_a_lot_selected' );
		}
		
		// Update the prevCheckbox variable to the one clicked now
		prevCheckbox = $thisControl;
		if ( $.isFunction( cb ) ) { cb(); }
	} );
	return $box;
};

}( jQuery, mediaWiki ) );
// </nowiki>