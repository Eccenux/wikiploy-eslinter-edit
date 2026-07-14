// UWAGA! Z tego gadżetu korzystają także inne projekty
// Original version:
// - QuickEditCounter script by [[:pl:User:ChP94]]
// - Released under the [http://www.gnu.org/licenses/gpl.txt GNU Public License (GPL)]
// Modified by [[:pl:User:Beau]], [[:pl:User:Nux]]

/* global jQuery */

window.qecGadget = {
	version: 10,

	init: function() {
		if ( mw.config.get( 'wgNamespaceNumber' ) != 2 && mw.config.get( 'wgNamespaceNumber' ) != 3 ) {
			return;
		}

		if ( mw.util.getParamValue('printable') == 'yes' ) {
			return;
		}

		this.username = mw.config.get( 'wgTitle' ).replace(/\/.*$/, '');

		let request = {
			action:	'query',
			list:	'users',
			usprop:	'editcount|gender',
			format:	'json',
			ususers:	this.username,
			requestid:	new Date().getTime()
		};

		const api = new mw.Api();
		api.get(request).then(( result ) => {
			jQuery(() => { // make sure doc is ready
				if (result) {
					this.showResults(result);
				}
			});
		});
	},
	showResults: function(data) {
		data = data.query.users[0];
		if (!data || data.name != this.username || data.invalid != null || data.editcount === undefined)
			return;

		let firstHeading;
		let headers = document.getElementsByTagName( 'h1' );

		for ( var i = 0; i < headers.length; i++ ) {
			var header = headers[i];
			if(header.className == "firstHeading" || header.id == "firstHeading" || header.className == "pagetitle") {
				firstHeading = header; break;
			}
		}

		if( !firstHeading ) {
			firstHeading = document.getElementById("section-0");
		}

		if( !firstHeading ) {
			return;
		}

		let lang = 'pl';
		let wiki = 'wikipedia';

		let m;
		// eslint-disable-next-line no-cond-assign
		if (m = mw.config.get( 'wgServer' ).match(/^(?:http:)?\/\/(.+?).([^.]+).org$/)) {
			lang = m[1];
			wiki = m[2];
		}
		// eslint-disable-next-line no-cond-assign
		else if (m = mw.config.get( 'wgScriptPath' ).match(/\/(.+?)\/(.+?)\//)) {
			lang = m[2];
			wiki = m[1];
		}

		let url = 'https://xtools.toolforge.org/ec/' + encodeURIComponent(lang) + '.' + encodeURIComponent(wiki) + '.org/' + encodeURIComponent(this.username);
		let html = data.gender == "female" ? 'Ta użytkowniczka wykonała' : 'Ten użytkownik wykonał';
		html += ` łącznie <a href="${url}">${data.editcount}</a> ${mw.language.convertPlural(data.editcount, ['edycję', 'edycje', 'edycji'])}.`;

		let prev = firstHeading.querySelector('.u-qec-info');
		if (prev) {
			prev.remove();
		}
		let div = document.createElement("div");
		div.style.cssText = "font-size:0.5em;line-height:1em";
		div.className = 'plainlinks u-qec-info';
		div.innerHTML = html;
		switch (mw.config.get( 'skin' )) {
			case 'modern': {
				div.style.marginLeft = "10px";
				div.style.display = "inline-block";
			}
				break;
			case 'vector-2022': {
				div.style.paddingBottom = '.3em';
			}
				break;
		}
		firstHeading.appendChild(div);
	}
};

// eslint-disable-next-line no-undef
qecGadget.init();