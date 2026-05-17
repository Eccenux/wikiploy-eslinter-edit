//<nowiki>
// DO NOT CHANGE THE NEXT LINE 
if (mw.config.get('wgUserLanguage') !== 'en') {
// DO NOT CHANGE THE PREVIOUS LINE
	mw.messages.set({
		// Preferences
		// new added: 2026-05-17. Tłumaczenie: 2026-05-17
		// Use user language for i18n
        'cat-a-lot-label'              : 'Cat-a-lot',
		'cat-a-lot-watchlistpref'      : 'Preferencje listy obserwowanych dotyczące stron edytowanych przez gadżet Cat-a-lot',
		'cat-a-lot-watch_pref'         : 'Według twoich ogólnych preferencji',
		'cat-a-lot-watch_nochange'     : 'Nie zmieniaj statusu strony',
		'cat-a-lot-watch_watch'        : 'Dodawaj do listy obserwowanych strony edytowane przez Cat-a-lot',
		'cat-a-lot-watch_unwatch'      : 'Usuwaj z listy obserwowanych strony edytowane przez Cat-a-lot',
		'cat-a-lot-minorpref'          : 'Oznacz edycje jako drobne',
		'cat-a-lot-editpagespref'      : 'Zezwól na kategoryzację stron (uwzględniając kategorie), które nie są plikami',
		'cat-a-lot-docleanuppref'      : 'Usuń {{Check categories}} i wykonaj inne drobne poprawki',
		'cat-a-lot-uncatpref'          : 'Usuń {{Uncategorized}}',
		'cat-a-lot-subcatcountpref'    : 'Maksymalna liczba pokazywanych podkategorii',
		'cat-a-lot-config-settings'    : 'Preferencje',
		'cat-a-lot-buttonpref'         : 'Używaj przycisków zamiast linków',
		'cat-a-lot-comment-label'      : 'Dodatkowy komentarz do opisu zmian',
		'cat-a-lot-remember-size'      : 'Zapamiętaj wymiary',
		'cat-a-lot-remember-state'     : 'Zapamiętaj kategorię',
		'cat-a-lot-session-timeout'    : 'Liczba minut, przez które Cat-a-lot zachowuje swój stan po wybraniu opcji „Zapamiętaj kategorię”',
		'cat-a-lot-missingcatalertpref': 'Pokazuj blokujący alert, gdy docelowa kategoria nie istnieje; w przeciwnym razie pokazuj tylko powiadomienie toast',
		// Progress
		'cat-a-lot-loading'          : 'Ładowanie…',
		'cat-a-lot-editing'          : 'Edycja strony',
		'cat-a-lot-of'               : 'z ',
		'cat-a-lot-skipped-already'  : 'Pominięto {{PLURAL:$1|1=poniższą stronę|poniższe $1 strony|poniższe $1 stron}}, ponieważ {{PLURAL:$1|1=była|były|były}} już w kategorii:',
		'cat-a-lot-skipped-not-found': 'Pominięto {{PLURAL:$1|1=poniższą stronę|poniższe $1 strony|poniższe $1 stron}}, ponieważ dotychczasowa kategoria nie została znaleziona:',
		'cat-a-lot-skipped-server'   : 'Pominięto {{PLURAL:$1|1=poniższą stronę|poniższe $1 strony|poniższe $1 stron}}, ponieważ wystąpił błąd połączenia z serwerem:',
		'cat-a-lot-all-done'         : 'Zmiany wprowadzone.',
		'cat-a-lot-done'             : 'Gotowe!',
		'cat-a-lot-added-cat'        : 'Dodano kategorię $1',
		'cat-a-lot-copied-cat'       : 'Skopiowano do kategorii $1',
		'cat-a-lot-moved-cat'        : 'Przeniesiono do kategorii $1',
		'cat-a-lot-removed-cat'      : 'Usunięto z kategorii $1',
		// 'cat-a-lot-return-to-page': 'Powrót do strony',
		// 'cat-a-lot-cat-not-found' : 'Nie znaleziono kategorii.',

		// as in 17 files selected
		'cat-a-lot-files-selected'   : 'Zaznaczono {{PLURAL:$1|1=1 plik|$1 pliki|$1 plików}}.',
		'cat-a-lot-pe_file'          : 'Dotyczy $1 {{PLURAL:$1|1=stronę|strony|stron}} z $2.',
		'cat-a-lot-parent-cat'       : 'Ma kategorię nadrzędną: ',
		'cat-a-lot-sub-cat'          : 'Ma podkategorię: ',

		// Actions
		'cat-a-lot-copy'           : 'Kopiuj',
		'cat-a-lot-move'           : 'Przenieś',
		'cat-a-lot-add'            : 'Dodaj',
		// 'cat-a-lot-remove-from-cat': 'Usuń z tej kategorii',
		'cat-a-lot-overcat'        : 'Sprawdź nadmierną kategoryzację',
		'cat-a-lot-enter-name'     : 'Wpisz nazwę kategorii',
		'cat-a-lot-select'         : 'Zaznacz',
		'cat-a-lot-all'            : 'wszystko',
		'cat-a-lot-none'           : 'nic',
		// 'cat-a-lot-none-selected': 'Nie zaznaczono żadnego pliku!'
		'cat-a-lot-search'         : 'Szukaj'
		});
}
// DO NOT CHANGE THE NEXT LINE 
if (mw.config.get('wgContentLanguage') !== 'en') {
// DO NOT CHANGE THE PREVIOUS LINE
	mw.messages.set({
		// Summaries (project language):
		'cat-a-lot-pref-save-summary': 'Zaktualizowano preferencje użytkownika',
		'cat-a-lot-summary-add'      : 'Dodano [[Kategoria:$1]]',
		'cat-a-lot-summary-copy'     : 'Skopiowano z kategorii [[Kategoria:$1|$1]] do kategorii [[Kategoria:$2|$2]]',
		'cat-a-lot-summary-move'     : 'Przeniesiono z kategorii [[Kategoria:$1|$1]] do kategorii [[Kategoria:$2|$2]]',
		'cat-a-lot-summary-remove'   : 'Usunięto z kategorii [[Kategoria:$1|$1]]',
		'cat-a-lot-prefix-summary'   : '', // Text to prepend to the edit summary. Set this to an empty string if you use 'using'.
		'cat-a-lot-using-summary'    : ' przy użyciu gadżetu [[c:Help:Cat-a-lot|Cat-a-lot]]', // Text to append to the edit summary. Set this to an empty string if you use 'prefix'.
		// Error dialog:
		'cat-a-lot-error-title' : 'Wystąpił błąd podczas edycji',
		'cat-a-lot-error'       : 'Wystąpił błąd podczas edycji $1',
		'cat-a-lot-ignore-error': 'Zignoruj i kontynuuj',
		'cat-a-lot-stop-editing': 'Wstrzymaj wszelkie edycje',
		
		//Self-categorization:
		'cat-a-lot-skip-self-cat-confirm': '„$1” nie zostanie skopiowana ani przeniesiona do siebie samej. Kontynuować z pozostałymi?',
		'cat-a-lot-no-valid-cats-after-filter': 'Brak kategorii do przeniesienia lub skopiowania po pominięciu samo-kategoryzacji.'
	});
}
//</nowiki>