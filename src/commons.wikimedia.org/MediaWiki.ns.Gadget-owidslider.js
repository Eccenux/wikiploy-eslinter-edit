/* eslint-disable no-useless-assignment */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/*
 * OWID Slider — Our World In Data SVG Image Stack Viewer for Wikimedia
 *
 * Purpose:
 *   Provide a self-contained OWIDSlider functionality used to
 *   preview OWID SVG image stacks with a timeline slider, per-country charts
 *   and lightweight translation support.
 *
 * Canonical Repo: https://github.com/wpmed/OWIDSlider
 *
 * Authors: Hellerhoff, Bawolff, Hassan M. Amin
 * Contributors: Booksmurf
 *
 * Notes:
 *   - This file expects to run in a MediaWiki-like environment or a test page
 *     that exposes the referenced globals. For local testing, use demo.html
 *
 * Initialization:
 *   The script calls $(OWIDSlider.init) at the end to attach the play button
 *   handlers and initialize the slider when the document is ready.
 */

// Add ESLint globals comment at the top of the file
// This tells ESLint these variables are intentionally global and expected to be available at runtime.
/* global OO, DOMPurify, $, jQuery, define */

var OWIDSlider = {
	// ---------------------------------------------------------------------
	// OWIDSlider.I18n
	// Purpose: centralize translations and message selection logic so it can be tested independently.
	// ---------------------------------------------------------------------
	I18n: {
		// Start translations. Add new languages under the appropriate language code.
		messages: {
			ar: {
				OWIDSliderFrameBack: 'رجوع',
				OWIDSliderFrameBackDesktop: 'العودة إلى المقالة',
				OWIDSliderFrameImageCredit: 'حقوق الوسائط',
				OWIDSliderFrameCopyLink: 'نسخ الرابط المباشر',
				OWIDSliderSliderLabel: 'اختر الصورة',
				OWIDSliderSelectRegion: 'اختر المنطقة',
				OWIDSliderPlayLabel: 'عرض عرض الشرائح',
				OWIDSliderLoading: 'جارٍ التحميل... $1%'
			},
			cz: {
				OWIDSliderFrameBack: 'Zpět',
				OWIDSliderFrameBackDesktop: 'Zpět na článek',
				OWIDSliderFrameImageCredit: 'Zdroje médií',
				OWIDSliderFrameCopyLink: 'Kopírovat přímý odkaz',
				OWIDSliderSliderLabel: 'Vybrat obrázek',
				OWIDSliderSelectRegion: 'Vybrat oblast',
				OWIDSliderPlayLabel: 'Zobrazit prezentaci',
				OWIDSliderLoading: 'Načítání... $1%'
			},
			de: {
				OWIDSliderFrameBack: 'Zurück',
				OWIDSliderFrameBackDesktop: 'Zurück zum Artikel',
				OWIDSliderFrameImageCredit: 'Mediencredits',
				OWIDSliderFrameCopyLink: 'Direkten Link kopieren',
				OWIDSliderSliderLabel: 'Bild auswählen',
				OWIDSliderSelectRegion: 'Region auswählen',
				OWIDSliderPlayLabel: 'Diashow anzeigen',
				OWIDSliderLoading: 'Laden... $1%'
			},
			en: {
				OWIDSliderFrameBack: 'Return to map',
				OWIDSliderFrameBackDesktop: 'Return to article',
				OWIDSliderFrameImageCredit: 'Media credits',
				OWIDSliderFrameCopyLink: 'Copy Direct Link',
				OWIDSliderSliderLabel: 'Select image',
				OWIDSliderSelectRegion: 'Select region',
				OWIDSliderPlayLabel: 'Show slideshow',
				OWIDSliderShowRegionGraph: "Graph",
				OWIDSliderLoading: 'Loading... $1%'
			},
			es: {
				OWIDSliderFrameBack: 'Atrás',
				OWIDSliderFrameBackDesktop: 'Volver al artículo',
				OWIDSliderFrameImageCredit: 'Créditos de medios',
				OWIDSliderFrameCopyLink: 'Copiar enlace directo',
				OWIDSliderSliderLabel: 'Seleccionar imagen',
				OWIDSliderSelectRegion: 'Seleccionar región',
				OWIDSliderPlayLabel: 'Mostrar presentación de diapositivas',
				OWIDSliderLoading: 'Cargando... $1%'
			},
			eu: {
				OWIDSliderFrameBack: 'Atzera',
				OWIDSliderFrameBackDesktop: 'Artikulura itzuli',
				OWIDSliderFrameImageCredit: 'Irudien kredituak',
				OWIDSliderFrameCopyLink: 'Lotura zuzena kopiatu',
				OWIDSliderSliderLabel: 'Irudia aukeratu',
				OWIDSliderSelectRegion: 'Eskualdea aukeratu',
				OWIDSliderPlayLabel: 'Irudien sorta erakutsi',
				OWIDSliderLoading: 'Kargatzen... $1%'
			},
			fa: {
				OWIDSliderFrameBack: 'بازگشت به نقشه',
				OWIDSliderFrameBackDesktop: 'بازگشت به مقاله',
				OWIDSliderFrameImageCredit: 'منبع و حقوق رسانه‌ها',
				OWIDSliderFrameCopyLink: 'رونوشت پیوند مستقیم',
				OWIDSliderSliderLabel: 'انتخاب نگاره',
				OWIDSliderSelectRegion: 'انتخاب منطقه',
				OWIDSliderPlayLabel: 'نمایش اسلایدشو',
				OWIDSliderLoading: 'در حال بارگذاری... $1%'
			},
			fr: {
				OWIDSliderFrameBack: 'Retour',
				OWIDSliderFrameBackDesktop: "Retour à l'article",
				OWIDSliderFrameImageCredit: 'Crédits médias',
				OWIDSliderFrameCopyLink: 'Copier le lien direct',
				OWIDSliderSliderLabel: "Sélectionner l'image",
				OWIDSliderSelectRegion: 'Sélectionner la région',
				OWIDSliderPlayLabel: 'Afficher le diaporama',
				OWIDSliderLoading: 'Chargement... $1%'
			},
			id: {
				OWIDSliderFrameBack: 'Kembali',
				OWIDSliderFrameBackDesktop: 'Kembali ke artikel',
				OWIDSliderFrameImageCredit: 'Kredit media',
				OWIDSliderFrameCopyLink: 'Salin pranala langsung',
				OWIDSliderSliderLabel: 'Pilih gambar',
				OWIDSliderSelectRegion: 'Pilih wilayah',
				OWIDSliderPlayLabel: 'Tampilkan tayangan salindia',
				OWIDSliderLoading: 'Memuat... $1%'
			},
			it: {
				OWIDSliderFrameBack: 'Indietro',
				OWIDSliderFrameBackDesktop: "Torna all'articolo",
				OWIDSliderFrameImageCredit: 'Crediti media',
				OWIDSliderFrameCopyLink: 'Copia link diretto',
				OWIDSliderSliderLabel: 'Seleziona immagine',
				OWIDSliderSelectRegion: 'Seleziona regione',
				OWIDSliderPlayLabel: 'Mostra presentazione',
				OWIDSliderLoading: 'Caricamento... $1%'
			},
			in: {
				OWIDSliderFrameBack: 'वापस',
				OWIDSliderFrameBackDesktop: 'लेख पर वापस जाएं',
				OWIDSliderFrameImageCredit: 'मीडिया क्रेडिट',
				OWIDSliderFrameCopyLink: 'प्रत्यक्ष लिंक कॉपी करें',
				OWIDSliderSliderLabel: 'छवि चुनें',
				OWIDSliderSelectRegion: 'क्षेत्र चुनें',
				OWIDSliderPlayLabel: 'स्लाइडशो दिखाएं',
				OWIDSliderLoading: 'लोड हो रहा है... $1%'
			},
			ja: {
				OWIDSliderFrameBack: '戻る',
				OWIDSliderFrameBackDesktop: '記事に戻る',
				OWIDSliderFrameImageCredit: 'メディアクレジット',
				OWIDSliderFrameCopyLink: '直接リンクをコピー',
				OWIDSliderSliderLabel: '画像を選択',
				OWIDSliderSelectRegion: '地域を選択',
				OWIDSliderPlayLabel: 'スライドショーを表示',
				OWIDSliderLoading: '読み込み中... $1%'
			},
			ko: {
				OWIDSliderFrameBack: '지도로 돌아가기',
				OWIDSliderFrameBackDesktop: '문서로 돌아가기',
				OWIDSliderFrameImageCredit: '미디어 정보',
				OWIDSliderFrameCopyLink: '다이렉트 링크 복사',
				OWIDSliderSliderLabel: '이미지 선택',
				OWIDSliderSelectRegion: '지역 선택',
				OWIDSliderPlayLabel: '슬라이드쇼 보기',
				OWIDSliderLoading: '불러오는 중... $1%'
			},
           sv: {
                OWIDSliderFrameBack: 'Gå tillbaka till kartan',
                OWIDSliderFrameBackDesktop: 'Gå tillbaka till artikeln',
                OWIDSliderFrameImageCredit: 'Mediaattribuering',
                OWIDSliderFrameCopyLink: 'Kopiera direktlänk',
                OWIDSliderSliderLabel: 'Välj bild',
                OWIDSliderSelectRegion: 'Välj region',
                OWIDSliderPlayLabel: 'Visa bildspel',
                OWIDSliderLoading: 'Laddar... $1%'
			},
			tr: {
				OWIDSliderFrameBack: 'Haritaya dön',
				OWIDSliderFrameBackDesktop: 'Makaleye dön',
				OWIDSliderFrameImageCredit: 'Medya kredileri',
				OWIDSliderFrameCopyLink: 'Doğrudan Bağlantıyı Kopyala',
				OWIDSliderSliderLabel: 'Resim seç',
				OWIDSliderSelectRegion: 'Bölge seçin',
				OWIDSliderPlayLabel: 'Slayt gösterisini göster',
				OWIDSliderLoading: 'Yükleniyor... $1%'	
			},	
			uk: {
				OWIDSliderFrameBack: 'Назад',
				OWIDSliderFrameBackDesktop: 'Повернутись до статті',
				OWIDSliderFrameImageCredit: 'Інформація про авторство',
				OWIDSliderFrameCopyLink: 'Копіювати пряме посилання',
				OWIDSliderSliderLabel: 'Вибрати зображення',
				OWIDSliderPlayLabel: 'Показати слайдшоу',
				OWIDSliderLoading: 'Завантаження... $1%'
			},
			zh: {
				OWIDSliderFrameBack: '返回',
				OWIDSliderFrameBackDesktop: '返回文章',
				OWIDSliderFrameImageCredit: '媒体来源',
				OWIDSliderFrameCopyLink: '复制直接链接',
				OWIDSliderSliderLabel: '选择图片',
				OWIDSliderSelectRegion: '选择区域',
				OWIDSliderPlayLabel: '显示幻灯片',
				OWIDSliderLoading: '加载中... $1%'
			},
			'zh-hant': {
				OWIDSliderFrameBack: '返回',
				OWIDSliderFrameBackDesktop: '返回文章',
				OWIDSliderFrameImageCredit: '媒體來源',
				OWIDSliderFrameCopyLink: '複製直接連結',
				OWIDSliderSliderLabel: '選擇圖片',
				OWIDSliderSelectRegion: '選擇區域',
				OWIDSliderPlayLabel: '顯示投影片',
				OWIDSliderLoading: '載入中... $1%'
			},
			'zh-hans': {
				OWIDSliderFrameBack: '返回',
				OWIDSliderFrameBackDesktop: '返回文章',
				OWIDSliderFrameImageCredit: '媒体来源',
				OWIDSliderFrameCopyLink: '复制直接链接',
				OWIDSliderSliderLabel: '选择图片',
				OWIDSliderSelectRegion: '选择区域',
				OWIDSliderPlayLabel: '显示幻灯片',
				OWIDSliderLoading: '加载中... $1%'
			},
			vt: {
				OWIDSliderFrameBack: 'Quay lại',
				OWIDSliderFrameBackDesktop: 'Quay lại bài viết',
				OWIDSliderFrameImageCredit: 'Nguồn hình ảnh',
				OWIDSliderFrameCopyLink: 'Sao chép liên kết trực tiếp',
				OWIDSliderSliderLabel: 'Chọn hình ảnh',
				OWIDSliderSelectRegion: 'Chọn khu vực',
				OWIDSliderPlayLabel: 'Hiển thị trình chiếu',
				OWIDSliderLoading: 'Đang tải... $1%'
			}
		},
		// End translations

		// Set the interface messages in the most appropriate language
		// Favor user language, then page content language, then site content language, then English.
		setMessages: function () {
			var userLanguage = mw.config.get( 'wgUserLanguage' );
			if ( userLanguage in OWIDSlider.I18n.messages ) {
				mw.messages.set( OWIDSlider.I18n.messages[ userLanguage ] );
				return;
			}
			var pageLanguage = mw.config.get( 'wgPageContentLanguage' );
			if ( pageLanguage in OWIDSlider.I18n.messages ) {
				mw.messages.set( OWIDSlider.I18n.messages[ pageLanguage ] );
				return;
			}
			var contentLanguage = mw.config.get( 'wgContentLanguage' );
			if ( contentLanguage in OWIDSlider.I18n.messages ) {
				mw.messages.set( OWIDSlider.I18n.messages[ contentLanguage ] );
				return;
			}
			mw.messages.set( OWIDSlider.I18n.messages.en );
		}
	}, // end I18n

	// ---------------------------------------------------------------------
	// OWIDSlider.Core
	// Purpose: init, configuration and i18n helpers grouped for easier testing.
	// Minimal behavioural changes: existing top-level APIs delegate to Core.
	// ---------------------------------------------------------------------
	Core: {
		// Initialize core runtime: build reverse maps, set messages and wire hook
		init: function () {
			// Build reverse Wikidata map if source map exists
			// Note: Object.fromEntries not allowed to be used on Wikimedia
			if ( OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP ) {
				OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP_REVERSE = Object.create( null );
				for ( let index in OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP ) {
					OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP_REVERSE[ OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP[ index ] ] = index;
				}
			}

			// Delegate message selection to I18n module
			OWIDSlider.I18n.setMessages();
			// Keep original hook behaviour
			mw.hook( 'wikipage.content' ).add( OWIDSlider.addPlayButton );
		},

		// Small helper to parse current URL query string into an object
		parseQueryParams: function () {
			// Not allowed to use Object.fromEntries()
			let res = Object.create( null );
			for ( const [ key, value ] of new URLSearchParams( location.search ) ) {
				res[ key ] = value;
			}
			return res;
		}
	}, // end Core

	// ---------------------------------------------------------------------
	// Backwards-compatible top-level delegations (minimal change)
	// ---------------------------------------------------------------------
	init: function () {
		return OWIDSlider.Core.init();
	},

	setMessages: function () {
		// preserve older API surface
		return OWIDSlider.I18n.setMessages();
	},

	parseQueryParams: function () {
		return OWIDSlider.Core.parseQueryParams();
	},

	// Expose messages at top-level for compatibility (tests may reference OWIDSlider.messages)
	get messages() {
		return OWIDSlider.I18n.messages;
	},

	// ---------------------------------------------------------------------
	// The rest of the original object (country maps, APIs, UI, Context, etc.)
	// remains unchanged below. Keep references and function names intact so behaviour is preserved.
	// ---------------------------------------------------------------------

	OWID_COUNTRY_CODES: {
		Afghanistan: 'AFG',
		'Åland-Islands': 'ALA',
		Albania: 'ALB',
		Algeria: 'DZA',
		'American-Samoa': 'ASM',
		Andorra: 'AND',
		Angola: 'AGO',
		Anguilla: 'AIA',
		Antarctica: 'ATA',
		'Antigua-and-Barbuda': 'ATG',
		Argentina: 'ARG',
		Armenia: 'ARM',
		Aruba: 'ABW',
		Australia: 'AUS',
		Austria: 'AUT',
		Azerbaijan: 'AZE',
		Bahamas: 'BHS',
		Bahrain: 'BHR',
		Bangladesh: 'BGD',
		Barbados: 'BRB',
		Belarus: 'BLR',
		Belgium: 'BEL',
		Belize: 'BLZ',
		Benin: 'BEN',
		Bermuda: 'BMU',
		Bhutan: 'BTN',
		Bolivia: 'BOL',
		'Bonaire,-Sint-Eustatius-and-Saba': 'BES',
		'Bosnia-and-Herzegovina': 'BIH',
		Botswana: 'BWA',
		'Bouvet-Island': 'BVT',
		Brazil: 'BRA',
		'British-Indian-Ocean-Territory': 'IOT',
		Brunei: 'BRN',
		Bulgaria: 'BGR',
		'Burkina-Faso': 'BFA',
		Burundi: 'BDI',
		Cambodia: 'KHM',
		Cameroon: 'CMR',
		Canada: 'CAN',
		'Cape-Verde': 'CPV',
		'Cayman-Islands': 'CYM',
		'Central-African-Republic': 'CAF',
		Chad: 'TCD',
		Chile: 'CHL',
		China: 'CHN',
		'Christmas-Island': 'CXR',
		'Cocos-(Keeling)-Islands': 'CCK',
		Colombia: 'COL',
		Comoros: 'COM',
		Congo: 'COG',
		'Democratic-Republic-of-Congo': 'COD',
		'Cook-Islands': 'COK',
		'Costa-Rica': 'CRI',
		"Cote-d'Ivoire": 'CIV',
		Croatia: 'HRV',
		Cuba: 'CUB',
		Curaçao: 'CUW',
		Cyprus: 'CYP',
		Czechia: 'CZE',
		Denmark: 'DNK',
		Djibouti: 'DJI',
		Dominica: 'DMA',
		'Dominican-Republic': 'DOM',
		Ecuador: 'ECU',
		Egypt: 'EGY',
		'El-Salvador': 'SLV',
		'Equatorial-Guinea': 'GNQ',
		Eritrea: 'ERI',
		Estonia: 'EST',
		Ethiopia: 'ETH',
		'Falkland-Islands-(Malvinas)': 'FLK',
		'Faroe-Islands': 'FRO',
		Fiji: 'FJI',
		Finland: 'FIN',
		France: 'FRA',
		'French-Guiana': 'GUF',
		'French-Polynesia': 'PYF',
		'French-Southern-Territories': 'ATF',
		Gabon: 'GAB',
		Gambia: 'GMB',
		Georgia: 'GEO',
		Germany: 'DEU',
		Ghana: 'GHA',
		Gibraltar: 'GIB',
		Greece: 'GRC',
		Greenland: 'GRL',
		Grenada: 'GRD',
		Guadeloupe: 'GLP',
		Guam: 'GUM',
		Guatemala: 'GTM',
		Guernsey: 'GGY',
		Guinea: 'GIN',
		'Guinea-Bissau': 'GNB',
		Guyana: 'GUY',
		Haiti: 'HTI',
		'Heard-Island-and-McDonald-Islands': 'HMD',
		'Holy-See-(Vatican-City-State)': 'VAT',
		Honduras: 'HND',
		'Hong-Kong': 'HKG',
		Hungary: 'HUN',
		Iceland: 'ISL',
		India: 'IND',
		Indonesia: 'IDN',
		Iran: 'IRN',
		Iraq: 'IRQ',
		Ireland: 'IRL',
		'Isle-of-Man': 'IMN',
		Israel: 'ISR',
		Italy: 'ITA',
		Jamaica: 'JAM',
		Japan: 'JPN',
		Jersey: 'JEY',
		Jordan: 'JOR',
		Kazakhstan: 'KAZ',
		Kenya: 'KEN',
		Kiribati: 'KIR',
		'North-Korea': 'PRK',
		'South-Korea': 'KOR',
		Kuwait: 'KWT',
		Kyrgyzstan: 'KGZ',
		Laos: 'LAO',
		Latvia: 'LVA',
		Lebanon: 'LBN',
		Lesotho: 'LSO',
		Liberia: 'LBR',
		Libya: 'LBY',
		Liechtenstein: 'LIE',
		Lithuania: 'LTU',
		Luxembourg: 'LUX',
		Macao: 'MAC',
		'North-Macedonia': 'MKD',
		Madagascar: 'MDG',
		Malawi: 'MWI',
		Malaysia: 'MYS',
		Maldives: 'MDV',
		Mali: 'MLI',
		Malta: 'MLT',
		'Marshall-Islands': 'MHL',
		Martinique: 'MTQ',
		Mauritania: 'MRT',
		Mauritius: 'MUS',
		Mayotte: 'MYT',
		Mexico: 'MEX',
		'Micronesia-(country)': 'FSM',
		Moldova: 'MDA',
		Monaco: 'MCO',
		Mongolia: 'MNG',
		Montenegro: 'MNE',
		Montserrat: 'MSR',
		Morocco: 'MAR',
		Mozambique: 'MOZ',
		Myanmar: 'MMR',
		Namibia: 'NAM',
		Nauru: 'NRU',
		Nepal: 'NPL',
		Netherlands: 'NLD',
		'New-Caledonia': 'NCL',
		'New-Zealand': 'NZL',
		Nicaragua: 'NIC',
		Niger: 'NER',
		Nigeria: 'NGA',
		Niue: 'NIU',
		'Norfolk-Island': 'NFK',
		'Northern-Mariana-Islands': 'MNP',
		Norway: 'NOR',
		Oman: 'OMN',
		Pakistan: 'PAK',
		Palau: 'PLW',
		'Palestinian-Territory,-Occupied': 'PSE',
		Panama: 'PAN',
		'Papua-New-Guinea': 'PNG',
		Paraguay: 'PRY',
		Peru: 'PER',
		Philippines: 'PHL',
		Pitcairn: 'PCN',
		Poland: 'POL',
		Portugal: 'PRT',
		'Puerto-Rico': 'PRI',
		Qatar: 'QAT',
		Réunion: 'REU',
		Romania: 'ROU',
		Russia: 'RUS',
		Rwanda: 'RWA',
		'Saint-Barthélemy': 'BLM',
		'Saint-Helena,-Ascension-and-Tristan-da-Cunha': 'SHN',
		'Saint-Kitts-and-Nevis': 'KNA',
		'Saint-Lucia': 'LCA',
		'Saint-Martin-(French-part)': 'MAF',
		'Saint-Pierre-and-Miquelon': 'SPM',
		'Saint-Vincent-and-the-Grenadines': 'VCT',
		Samoa: 'WSM',
		'San-Marino': 'SMR',
		'Sao-Tome-and-Principe': 'STP',
		'Saudi-Arabia': 'SAU',
		Senegal: 'SEN',
		Serbia: 'SRB',
		Seychelles: 'SYC',
		'Sierra-Leone': 'SLE',
		Singapore: 'SGP',
		'Sint-Maarten-(Dutch-part)': 'SXM',
		Slovakia: 'SVK',
		Slovenia: 'SVN',
		'Solomon-Islands': 'SLB',
		Somalia: 'SOM',
		'South-Africa': 'ZAF',
		'South-Georgia-and-the-South-Sandwich-Islands': 'SGS',
		'South-Sudan': 'SSD',
		Spain: 'ESP',
		'Sri-Lanka': 'LKA',
		Sudan: 'SDN',
		Suriname: 'SUR',
		'Svalbard-and-Jan-Mayen': 'SJM',
		Eswatini: 'SWZ',
		Sweden: 'SWE',
		Switzerland: 'CHE',
		Syria: 'SYR',
		'Taiwan,-Province-of-China': 'TWN',
		Tajikistan: 'TJK',
		Tanzania: 'TZA',
		Thailand: 'THA',
		'East-Timor': 'TLS',
		Togo: 'TGO',
		Tokelau: 'TKL',
		Tonga: 'TON',
		'Trinidad-and-Tobago': 'TTO',
		Tunisia: 'TUN',
		Turkey: 'TUR',
		Turkmenistan: 'TKM',
		'Turks-and-Caicos-Islands': 'TCA',
		Tuvalu: 'TUV',
		Uganda: 'UGA',
		Ukraine: 'UKR',
		'United-Arab-Emirates': 'ARE',
		'United-Kingdom': 'GBR',
		'United-States': 'USA',
		'United-States-Minor-Outlying-Islands': 'UMI',
		Uruguay: 'URY',
		Uzbekistan: 'UZB',
		Vanuatu: 'VUT',
		Venezuela: 'VEN',
		Vietnam: 'VNM',
		'Virgin-Islands,-British': 'VGB',
		'Virgin-Islands,-U.S.': 'VIR',
		'Wallis-and-Futuna': 'WLF',
		'Western-Sahara': 'ESH',
		Yemen: 'YEM',
		Zambia: 'ZMB',
		Zimbabwe: 'ZWE'
	},

	OWID_WIKIDATA_COUNTRY_MAP: {
		frenchguiana: 'Q3769',
		frenchsouthernterritories: 'Q129003',
		kosovo: 'Q1246',
		liechtenstein: 'Q347',
		newcaledonia: 'Q33788',
		westernsahara: 'Q6250',
		russia: 'Q159',
		unitedstates: 'Q30',
		canada: 'Q16',
		china: 'Q148',
		brazil: 'Q155',
		greenland: 'Q223',
		australia: 'Q408',
		fiji: 'Q712',
		india: 'Q668',
		indonesia: 'Q252',
		argentina: 'Q414',
		kazakhstan: 'Q232',
		norway: 'Q20',
		mexico: 'Q96',
		algeria: 'Q262',
		democraticrepublicofcongo: 'Q974',
		mongolia: 'Q711',
		saudiarabia: 'Q851',
		chile: 'Q298',
		iran: 'Q794',
		mali: 'Q912',
		japan: 'Q17',
		peru: 'Q419',
		pakistan: 'Q843',
		sudan: 'Q1049',
		libya: 'Q1016',
		southafrica: 'Q258',
		colombia: 'Q739',
		niger: 'Q1032',
		sweden: 'Q34',
		mozambique: 'Q1029',
		ethiopia: 'Q115',
		angola: 'Q916',
		chad: 'Q657',
		myanmar: 'Q836',
		namibia: 'Q1030',
		bolivia: 'Q750',
		mauritania: 'Q1025',
		venezuela: 'Q717',
		newzealand: 'Q664',
		uzbekistan: 'Q265',
		ukraine: 'Q212',
		somalia: 'Q1045',
		france: 'Q142',
		afghanistan: 'Q889',
		italy: 'Q38',
		papuanewguinea: 'Q691',
		philippines: 'Q928',
		thailand: 'Q869',
		turkey: 'Q43',
		tanzania: 'Q924',
		malaysia: 'Q833',
		egypt: 'Q79',
		centralafricanrepublic: 'Q929',
		nigeria: 'Q1033',
		zambia: 'Q953',
		finland: 'Q33',
		micronesia: 'Q3359409',
		vietnam: 'Q881',
		turkmenistan: 'Q874',
		southsudan: 'Q958',
		madagascar: 'Q1019',
		morocco: 'Q1028',
		spain: 'Q29',
		botswana: 'Q963',
		cameroon: 'Q1009',
		kenya: 'Q114',
		iraq: 'Q796',
		unitedkingdom: 'Q145',
		oman: 'Q842',
		germany: 'Q183',
		paraguay: 'Q733',
		yemen: 'Q805',
		congo: 'Q971',
		laos: 'Q819',
		poland: 'Q36',
		zimbabwe: 'Q954',
		belarus: 'Q184',
		greece: 'Q41',
		kyrgyzstan: 'Q813',
		romania: 'Q218',
		burkinafaso: 'Q965',
		guinea: 'Q1006',
		eritrea: 'Q986',
		cotedivoire: 'Q1008',
		ecuador: 'Q736',
		cuba: 'Q241',
		gabon: 'Q1000',
		northkorea: 'Q423',
		guyana: 'Q734',
		syria: 'Q858',
		nepal: 'Q837',
		iceland: 'Q189',
		tajikistan: 'Q863',
		uganda: 'Q1036',
		tunisia: 'Q948',
		ghana: 'Q117',
		tuvalu: 'Q672',
		bangladesh: 'Q902',
		senegal: 'Q1041',
		uruguay: 'Q77',
		solomonislands: 'Q685',
		malawi: 'Q1020',
		croatia: 'Q224',
		cambodia: 'Q424',
		azerbaijan: 'Q227',
		austria: 'Q40',
		nicaragua: 'Q811',
		honduras: 'Q783',
		hungary: 'Q28',
		bulgaria: 'Q219',
		benin: 'Q962',
		jordan: 'Q810',
		suriname: 'Q730',
		unitedarabemirates: 'Q878',
		portugal: 'Q45',
		czechia: 'Q213',
		latvia: 'Q211',
		georgia: 'Q230',
		guatemala: 'Q774',
		serbia: 'Q403',
		liberia: 'Q1014',
		southkorea: 'Q884',
		panama: 'Q804',
		ireland: 'Q27',
		lithuania: 'Q37',
		denmark: 'Q35',
		slovakia: 'Q214',
		estonia: 'Q191',
		netherlands: 'Q55',
		costarica: 'Q800',
		moldova: 'Q217',
		bosniaaherzegovin: 'Q225',
		sierraleone: 'Q1044',
		togo: 'Q945',
		switzerland: 'Q39',
		dominicanrepublic: 'Q786',
		srilanka: 'Q854',
		armenia: 'Q399',
		belgium: 'Q31',
		bahamas: 'Q778',
		capeverde: 'Q1011',
		taiwan: 'Q865',
		israel: 'Q801',
		haiti: 'Q790',
		albania: 'Q222',
		bhutan: 'Q917',
		guineabissau: 'Q1007',
		lesotho: 'Q1013',
		tonga: 'Q678',
		slovenia: 'Q215',
		burundi: 'Q967',
		northmacedonia: 'Q221',
		rwanda: 'Q1037',
		montenegro: 'Q236',
		elsalvador: 'Q792',
		djibouti: 'Q977',
		belize: 'Q242',
		kuwait: 'Q817',
		easttimor: 'Q574',
		cyprus: 'Q229',
		equatorialguinea: 'Q983',
		vanuatu: 'Q686',
		lebanon: 'Q822',
		marshallislands: 'Q709',
		eswatini: 'Q1050',
		gambia: 'Q1005',
		brunei: 'Q921',
		jamaica: 'Q766',
		palestine: 'Q219060',
		qatar: 'Q846',
		comoros: 'Q970',
		puertorico: 'Q1183',
		trinidadandtobago: 'Q754',
		samoa: 'Q683',
		luxembourg: 'Q32',
		mauritius: 'Q1027',
		singapore: 'Q334',
		antiguaandbarbuda: 'Q781',
		maldives: 'Q826',
		kiribati: 'Q710',
		saotomeandprincipe: 'Q1039',
		dominica: 'Q784',
		saintkittsandnevis: 'Q763',
		bahrain: 'Q398',
		saintlucia: 'Q760',
		andorra: 'Q228',
		barbados: 'Q244',
		seychelles: 'Q1042',
		malta: 'Q233',
		saintvincentandthegrenadines: 'Q757',
		grenada: 'Q769',
		palau: 'Q695',
		sanmarino: 'Q238',
		nauru: 'Q697',
		monaco: 'Q235'
	},

	// Moved to Core
	// init: function () {
	// OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP_REVERSE = Object.fromEntries(
	// 	Object.entries(OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP).map(function([key, value]) {
	//   		return [value, key];
	// 	})
	// );
	//   OWIDSlider.setMessages();
	//   mw.hook("wikipage.content").add(OWIDSlider.addPlayButton);
	// },

	purify: function ( dirty ) {
		// We use SVGs in an html context not XML, so we need to be sure they are safe.
		// This is a bit stricter than necessary, but owid graphs should have all this.
		DOMPurify.addHook( 'uponSanitizeAttribute', function ( node, hook ) {
			if ( [ 'font', 'clip-path', 'fill', 'filter', 'marker', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'stroke', 'cursor' ].includes( hook.attrName ) ) {
				if ( hook.attrValue.match( /url\((?!\s*['"]?#)|image-set\(|src\(/i ) ) {
					hook.keepAttr = false;
				}
			}
			if ( [ 'href', 'xlink:href' ].includes( hook.attrName ) ) {
				hook.keepAttr = false;
			}
		} );
		DOMPurify.addHook( 'uponSanitizeElement', function ( node ) {
			if ( node && node.tagName && node.tagName.toLowerCase() === 'style' && node.textContent.match( /url\((?!\s*['"]?#)|image-set\(|src\(/i ) ) {
				node.textContent = '';
			}
		} );
		var res = DOMPurify.sanitize( dirty, { USE_PROFILES: { svg: true } } );
		DOMPurify.removeHook( 'uponSanitizeAttribute' );
		DOMPurify.removeHook( 'uponSanitizeElement' );
		return res;
	},

	// Moved to I18n
	/**
	 * Set the interface messages in the most appropriate language
	 *
	 * Favor the user language first, the page language second, the wiki language third, and lastly English
	 */

	// Moved to I18n
	// setMessages: function () {
	//   var userLanguage = mw.config.get("wgUserLanguage");
	//   if (userLanguage in OWIDSlider.messages) {
	//     mw.messages.set(OWIDSlider.messages[userLanguage]);
	//     return;
	//   }
	//   var pageLanguage = mw.config.get("wgPageContentLanguage");
	//   if (pageLanguage in OWIDSlider.messages) {
	//     mw.messages.set(OWIDSlider.messages[pageLanguage]);
	//     return;
	//   }
	//   var contentLanguage = mw.config.get("wgContentLanguage");
	//   if (contentLanguage in OWIDSlider.messages) {
	//     mw.messages.set(OWIDSlider.messages[contentLanguage]);
	//     return;
	//   }
	//   mw.messages.set(OWIDSlider.messages.en);
	// },

	// Moved to Core
	// parseQueryParams: function () {
	// return Object.fromEntries( new URLSearchParams( location.search ) );
	// },

	/**
	 * Append a play button ► to every OWIDSlider div
	 *
	 * @param $content
	 */
	addPlayButton: function ( $content ) {
		var queryParams = OWIDSlider.parseQueryParams();
		$content.find( 'div.OWIDSlider' ).each( function () {
			var $frame = $( this );
			var viewerInfo = $frame.data( 'owidsliderConfig' );
			if ( !( viewerInfo instanceof Array ) ) {
				return;
			}
			// match both img and span for broken files in galleries
			$frame
				.find( '.mw-file-element, .lazy-image-placeholder' )
				.each( function ( i ) {
					if (
						viewerInfo[ i ] instanceof Object && typeof viewerInfo[ i ].list === 'string'
					) {
						// We used to use unicode ▶, but was rendered inconsitently between browsers, so switch to svg.
						var $play = $( '<button></button>' )
							.attr( {
								type: 'button',
								class: 'OWIDSlider-play',
								title: mw.msg( 'OWIDSliderPlayLabel' ),
								'aria-label': mw.msg( 'OWIDSliderPlayLabel' )
							} )
							.html( '<svg viewbox="0 0 10 10"><circle class="circle" cx="5" cy="5" r="5"></circle><polygon class="triangle" points="2.5,2 8.5,5 2.5,8"></polygon></svg>' );
						var data = viewerInfo[ i ];
						$play.on( 'click', function ( e ) {
							e.preventDefault();
							if (
								!queryParams.owid_list || queryParams.owid_list.toLowerCase() !== decodeURIComponent( data.list.toLowerCase() )
							) {
								var newUrl = new URL( window.location.href );
								newUrl.searchParams.set( 'owid_list', encodeURIComponent( data.list ) );
								if ( data.language && data.language !== '' ) {
									newUrl.searchParams.set( 'owid_language', encodeURIComponent( data.language ) );
								}

								window.history.pushState( {}, '', newUrl );
								OWIDSlider.showFrame( data );
							} else {
								OWIDSlider.showFrame( data );
							}
						} );
						var $this = $( this );
						$this.parent().css( {
							display: 'inline-block',
							height: 'fit-content',
							position: 'relative'
						} );
						$this.after( $play );
						var listMatch = queryParams.owid_list && data.list && decodeURIComponent( queryParams.owid_list.toLowerCase() ) === decodeURIComponent( data.list.toLowerCase() );
						var langMatch = (
							// Handle language cases
							// 1. No language in uri and this doesnt have language
							( !data.language && !queryParams.owid_language ) ||
							// 2. Language in uri and this has language
						( data.language && queryParams.owid_language && data.language === decodeURIComponent( queryParams.owid_language.toLowerCase() ) )
						);
						if (
						listMatch && langMatch
						) {
							OWIDSlider.showFrame( data );
						}
					}
				} );
		} );
	},

	showFrame: function ( data ) {
		// Load dependencies
		var stateWindow = mw.loader.getState( 'oojs-ui-windows' );
		// In recent MW VE, DOMPurify is not a top level module.
		var stateDomPurify = mw.loader.getState( 'ext.visualEditor.core' );
		if ( stateWindow !== 'ready' || stateDomPurify !== 'ready' ) {
			mw.loader.using( [ 'oojs-ui-windows', 'ext.visualEditor.core' ], function () {
				OWIDSlider.showFrame( data );
			} );
			return;
		}
		var $viewer = OWIDSlider.getViewer();
		var backButtonTitle = mw.msg( 'OWIDSliderFrameBackDesktop' );

		var config = {
			size: 'full',
			// This doesn't seem to work.
			classes: 'OWIDSliderDialog',
			title: typeof data.title === 'string' ? data.title : false,
			actions: [
				{
					action: 'accept',
					label: backButtonTitle,
					flags: [ 'primary', 'progressive' ]
				}
			],
			message: $viewer
		};

		var dialog = function ( config ) {
			dialog.super.call( this, config );
			this.$element.addClass( 'OWIDSliderDialog' );
		};

		OO.inheritClass( dialog, OO.ui.MessageDialog );
		dialog.static.name = 'OWIDSlider';
		OO.ui.getWindowManager().addWindows( [ new dialog() ] );
		// copied from OO.ui.alert definition.

		var win = OO.ui.getWindowManager().openWindow( 'OWIDSlider', config );
		win.closing.done( function () {
		var newUrl = new URL( window.location.href );
			newUrl.searchParams.delete( 'owid_list' );
			newUrl.searchParams.delete( 'owid_language' );

			window.history.pushState( {}, '', newUrl );
		} );
		win.closed.done( function () {
			// There has to be a better way to do this.
			if ( window.OWIDSliderCancel ) {
				window.OWIDSliderCancel();
			}
		} );
		OWIDSlider.loadImages( $viewer, data );
	},

	getViewer: function () {
		var $viewer = $( '<div></div>' ).attr( {
			class: 'OWIDSlider-viewer OWIDSlider-loading'
		} );
		// From https://commons.wikimedia.org/wiki/File:Loading_spinner.svg
		$viewer.append(
			'<svg xmlns="http://www.w3.org/2000/svg" aria-label="Loading..." viewBox="0 0 100 100" width="25%" height="25%" style="display:block;margin:auto"><rect fill="#555" height="6" opacity=".083" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".167" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".25" rx="3" ry="3" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".417" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".583" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".667" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".833" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".917" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"/></svg>'
		);
		return $viewer;
	},
	loadCommonsTemmplate: function(list, language) {
		return new Promise(function(resolve, reject) {
			var api = new mw.Api({
				userAgent: 'OWIDSlider',
				ajax: {
					url: 'https://commons.wikimedia.org/w/api.php'
				}
			});
			api.get({
				action: 'parse',
				page: list,
				format: 'json',
				prop: 'text',
				uselang: language,
				origin: '*', // This helps with CORS,
				redirects: "1",
			})
			.then( function ( res ) {
				console.log({res});
				if ( res.parse ) {
					const text = res.parse.text[ '*' ];
					resolve(text);
				}
			}).catch( function ( error ) {
				console.error( 'Error:', error );
			});
		});
	},
	loadImages: function ( $viewer, data ) {
		var url = '';
		var page = mw.Title.newFromText( data.list );
		if (!page) {
			console.log( 'Image stack error, invalid page ' + data.list );
			return;
		}
		if (data.location && data.location.toLowerCase() === 'commons') {
		// var templateName = page.title; /* eslint no-unused var*/
			this.loadCommonsTemmplate(data.list, data.language)
			.then(function(text) {
				return OWIDSlider.handlePage( $viewer, data, text );
			})
			.catch(function(err) {
				console.log("Error loading list: ", err);
			});
		} else {
			url = page.getUrl();
			fetch( url )
			.then( function ( response ) {
			return response.text();
			} )
			.then( function ( text ) {
			return OWIDSlider.handlePage( $viewer, data, text );
			} );
		}
	},

	handlePage: function ( $viewer, data, text ) {
		var parser = new DOMParser();
		var listDoc = parser.parseFromString( text, 'text/html' );
		var idSelector = mw.Title.newFromText( data.list ).getFragment();

		var listElm = listDoc.getElementById( idSelector );
		if ( !listElm || !listElm.dataset.owidSubids ) {
			console.log( 'Error finding element in list document', idSelector, listElm );
			return;
		}

		var subIds = JSON.parse( listElm.dataset.owidSubids );
		if ( !subIds || typeof subIds !== 'object' ) {
			console.log( 'invalid owidsubids' );
			return;
		}

		var years = Object.create( null ),
			imgMap = Object.create( null );
		var min = 1e9,
			max = -1e9,
			width,
			height,
			viewMin;
		var countriesUrls = Object.create( null );
		var countriesInfoUrls = Object.create( null );
		var regionsChartsUrls = Object.create( null );
		var regionsChartsInfoUrls = Object.create( null );
		this.translatedCountryNames = Object.create( null );
		for ( let galleryName in subIds ) {
			var galleryId = subIds[ galleryName ];
			var elm = listDoc.getElementById( galleryId );
			try {
				if ( !elm ) {
					throw new Error( 'Could not find gallery with id ' + galleryId );
				}

				if ( galleryName === 'AllCountries') {
					years[ galleryName ] = JSON.parse( elm.dataset.owidsliderCountry );
				} else if (galleryName === 'RegionsCharts') {
					var jsonContent = elm.dataset.owidsliderRegionscharts || data.dataset.owidsliderRegionsChart;
					years[ galleryName ] = JSON.parse( jsonContent );
				} else {
					years[ galleryName ] = JSON.parse( elm.dataset.owidsliderYear );
				}
			} catch(err) {
				console.log("error parsing dataset content for gallery", galleryName, err);
				continue;
			}
			if (
				!( years[ galleryName ] instanceof Array ) ||
		years[ galleryName ].length < 1
			) {
				throw new Error( 'Invalid data-owidslider-years ' + galleryId );
			}

			var imgs = elm.querySelectorAll(
				'img.mw-file-element, span[typeof~="mw:Error"][typeof~="mw:File"]'
			);
			if ( galleryName === 'RegionsCharts' ) {
				for ( let j = 0; j < imgs.length; j++ ) {
					if ( imgs[ j ].nodeName !== 'IMG' ) {
						continue;
					}
					regionsChartsUrls[ years[ galleryName ][ j ] ]  = this.convertThumbUrlToOriginal(
						imgs[ j ].getAttribute( 'src' )
					);
					if ( imgs[ j ].parentElement.href ) {
						regionsChartsInfoUrls[ years[ galleryName ][ j ] ] = imgs[ j ].parentElement.href;
					}
				}
			} else if ( galleryName === 'AllCountries' ) {
				for ( let j = 0; j < imgs.length; j++ ) {
					if ( imgs[ j ].nodeName !== 'IMG' ) {
						continue;
					}
					countriesUrls[ years[ galleryName ][ j ] ] = this.convertThumbUrlToOriginal(
						imgs[ j ].getAttribute( 'src' )
					);
					if ( imgs[ j ].parentElement.href ) {
						countriesInfoUrls[ years[ galleryName ][ j ] ] = imgs[ j ].parentElement.href;
					}
				}
			} else {
				imgMap[ galleryName ] = [];
				for ( let i = 0; i < imgs.length; i++ ) {
					if (
						typeof years[ galleryName ][ i ] !== 'number' || imgs[ i ].nodeName !== 'IMG'
					) {
						continue;
					}
					imgMap[ galleryName ][ years[ galleryName ][ i ] ] = imgs[ i ];
					if ( years[ galleryName ][ i ] < min ) {
						min = years[ galleryName ][ i ];
						width = imgMap[ galleryName ][ min ].width;
						height = imgMap[ galleryName ][ min ].height;
						viewMin = galleryName;
					}
					if ( years[ galleryName ][ i ] > max ) {
						max = years[ galleryName ][ i ];
					}
				}
			}
		}
		if ( min === 1e9 ) {
			throw new Error( 'No images for slider' );
		}
		var urls = this.getImagesUrls( imgMap );
		// eslint-disable-next-line no-new
		new OWIDSlider.Context(
			$viewer,
			data,
			imgMap,
			urls,
			countriesUrls,
			countriesInfoUrls,
			regionsChartsUrls,
			regionsChartsInfoUrls,
			width,
			height,
			min,
			max,
			viewMin
		);
	},

	getSource: function ( imgElm, width, height ) {
		// desired dimensions
		var w = width * window.devicePixelRatio;
		var h = height * window.devicePixelRatio;
		// current candidate
		var imgW = parseInt( imgElm.width );
		var imgH = parseInt( imgElm.height );
		// img tag width/height.
		var originalW = imgW;
		var originalH = imgH;
		var src = imgElm.src;
		if ( imgW >= w && imgH >= h ) {
			return src;
		}
		var srcSets = imgElm.srcset.split( /\s*,\s*/ );
		for ( let i = 0; i < srcSets.length; i++ ) {
			var parts = srcSets[ i ].match( /^(\S+)\s+([0-9.])x\s*$/ );
			if ( parts && parts.length === 3 ) {
				var pixelRatio = parseFloat( parts[ 2 ] );
				if (
					( imgW < w && originalW * pixelRatio > imgW ) || ( imgW > w && originalW * pixelRatio - w >= 0 && originalW * pixelRatio < imgW )
				) {
					imgW = originalW * pixelRatio;
					imgH = originalH * pixelRatio;
					src = parts[ 1 ];
				}
			}
		}
		return src;
	},
	convertThumbUrlToOriginal: function ( thumbUrl ) {
		var urlParts = thumbUrl.split( '/' );
		var fileName = urlParts.filter( function ( a ) {
			return a && a.includes( '.svg' );
		} )[ 0 ];
		var fileNameIndex = urlParts.indexOf( fileName );
		var hashes = urlParts.slice( fileNameIndex - 2, fileNameIndex );
		var prefix = thumbUrl.split( 'thumb/' )[ 0 ];
		return prefix + hashes.join( '/' ) + '/' + fileName;
	},
	getImagesUrls: function ( imgs ) {
		var urls = Object.create( null );
		for ( let i in imgs ) {
			var region = [];
			for ( let j in imgs[ i ] ) {
				region[ j ] = {
					url: this.convertThumbUrlToOriginal( imgs[ i ][ j ].getAttribute( 'src' ) )
				};
			}
			urls[ i ] = region;
		}
		return urls;
	},

	doStats: function () {
		if ( window.OWIDSliderStatsAlreadyDone !== true ) {
			window.OWIDSliderStatsAlreadyDone = true;
			const wiki = mw.config.get( 'wgDBname' );
			const title = mw.config.get( 'wgTitle' );
			const titlee = title.replace( / /g, '_' );
			const page = encodeURIComponent( titlee ).replace( /[^a-zA-Z0-9_]/g, '_' ); // Alphanumeric and underscore only
			const namespace = mw.config.get( 'wgNamespaceNumber' );
			mw.track( 'stats.mediawiki_gadget_OWIDSlider_wiki_total', 1, { wiki: wiki } );
			mw.track( 'stats.mediawiki_gadget_OWIDSlider_page_total', 1, { wiki: wiki, page: page, NS: namespace } );
		}
	},
	copyExecCommand: function ( text ) {
		var span = document.createElement( 'span' );
		span.textContent = text;

		// Preserve consecutive spaces and newlines
		span.style.whiteSpace = 'pre';
		span.style.webkitUserSelect = 'auto';
		span.style.userSelect = 'all';

		// Add the <span> to the page
		document.body.appendChild( span );
		var selection = window.getSelection();
		var range = window.document.createRange();
		selection.removeAllRanges();
		range.selectNode( span );
		selection.addRange( range );

		// Copy text to the clipboard
		var success = false;
		try {
			success = window.document.execCommand( 'copy' );
		} finally {
			// Cleanup
			selection.removeAllRanges();
			window.document.body.removeChild( span );
		}

		return success;
	},

	copyText: function ( text ) {
		if ( navigator.clipboard ) {
			return navigator.clipboard
				.writeText( text )
				.then( function () {} )
				.catch( function ( err ) {
					console.log( 'Error copying' );
					console.log( err );
					OWIDSlider.copyExecCommand( text );
				} );
		}
		OWIDSlider.copyExecCommand( text );
	},

	Context: function (
		$viewer,
		config,
		imgs,
		urls,
		countriesUrls,
		countriesInfoUrls,
		regionsChartsUrls,
		regionsChartsInfoUrls,
		width,
		height,
		min,
		max,
		viewMin
	) {
		OWIDSlider.doStats();
		this.svgUrls = urls;
		this.countriesSvgUrls = countriesUrls;
		this.countriesInfoUrls = countriesInfoUrls;
		this.regionsChartsUrls = regionsChartsUrls;
		this.regionsChartsInfoUrls = regionsChartsInfoUrls;
		this.translatedCountryNames = Object.create( null );
		this.$viewer = $viewer;
		this.loop = !!config.loop;
		this.start = typeof config.start === 'number' ? config.start : 0;
		this.urls = null;
		this.infoUrls = null;
		this.imgs = imgs;
		this.min = min;
		this.max = max;
		this.viewMin = viewMin; // The view that has the min element
		this.currentView = config.startingView && imgs[ config.startingView ] ?
			config.startingView :
			Object.keys( imgs )[ 0 ];
		this.language = config.language ? config.language.trim() : '';
		this.total = Object.keys( imgs[ this.currentView ] ).length;
		// for (var i in imgs) {
		//   this.total += Object.keys(imgs[i]).length;
		// }
		this.captionId = typeof config.caption === 'string' ? config.caption : false;
		// Future TODO - make the size of image adaptive to screen size
		// Future TODO - handle images of different sizes and aspect ratios.
		this.width = config.width;
		this.height = config.height;
		if ( this.width && !this.height ) {
			this.height = ( this.width * height ) / width;
		}
		if ( !this.width && this.height ) {
			this.width = ( this.height * width ) / height;
		}
		this.imgWidth = width;
		this.imgHeight = height;
		this.currentImage =
      this.start >= this.min && this.start <= this.max ? this.start : this.max;
		this.pendingFrame = false;
		this.$loading = $( '#OWIDSliderLoading' );
		this.urlsLoaded = 0;
		this.pendingTouches = Object.create( null );
		this.prevImage = 0;
		this.config = config;

		this.init();
	}
};

// This part is based on Hellerhoff's https://commons.wikimedia.org/wiki/MediaWiki:Gadget-OWIDSlider.js
OWIDSlider.Context.prototype = {
	createLoader: function () {
		var $loading = $( '#OWIDSliderLoading' );
		if ( !$loading.length ) {
			$loading = $( '<div></div>' ).attr( {
				id: 'OWIDSliderLoading',
				role: 'status'
			} );
			$( document.body ).append( $loading );
		}
		$loading.text( mw.msg( 'OWIDSliderLoading', '0' ) );
		return $loading;
	},
	init: function () {
		this.$loading = this.createLoader();
		var that = this;
		// Chrome scrolls much faster than firefox
		const SCROLL_SLOWDOWN = navigator.userAgent.includes( 'Chrome/' ) ? 5 : 2;
		this.pendingScrollDelta = 0;

		// 	var containingWidth =
		//   this.$viewer[ 0 ].parentElement.parentElement.parentElement.clientWidth; /* eslint no-unused var*/
		// 	var containingHeight =
		//   this.$viewer[ 0 ].parentElement.parentElement.parentElement.clientHeight; /* eslint no-unused var*/
		this.$viewer.empty();

		this.$slider = $( '<input>', {
			type: 'range',
			min: that.min,
			max: that.max,
			value: this.currentImage
		} ).on( 'input', function ( e ) {
			that.currentImage = parseInt( e.target.value );
			that.repaint();
		} );
		this.$sliderYearPopup = $( '<span></span>', {
			class: 'OWIDSliderSliderYearPopup'
		} ).css( 'visibility', 'hidden' );

		this.$sliderRangeContainer = $( '<span></span>', {
			'aria-label': mw.msg( 'OWIDSliderSliderLabel' ),
			class: 'OWIDSliderSlider'
		} )
			.append( this.$slider )
			.append( this.$sliderYearPopup );

		this.$sliderContainer = $( '<div></div>' )
			.attr( {
				class: 'OWIDSliderSliderContainer'
			} )
			.append( $( '<span id="OWIDSliderBegin"></span>' ).text( this.min ) )
			.append( this.$sliderRangeContainer )
			.append( $( '<span id="OWIDSliderEnd"></span>' ).text( this.max ) );
		var handleTouchStart = this.handleTouchStart.bind( this );
		var handleTouchMove = this.handleTouchMove.bind( this );
		var handleTouchCancel = this.handleTouchCancel.bind( this );
		var handleTouchEnd = this.handleTouchEnd.bind( this );
		var touchElement = this.$viewer[ 0 ].parentElement.parentElement;
		var opt = { passive: true };

		// For now it seems like we don't have to cancel events. Unclear if we should
		touchElement.addEventListener( 'touchstart', handleTouchStart, opt );
		touchElement.addEventListener( 'touchmove', handleTouchMove, opt );
		touchElement.addEventListener( 'touchend', handleTouchEnd, opt );
		touchElement.addEventListener( 'touchcancel', handleTouchCancel, opt );

		// Hacky!
		window.OWIDSliderCancel = function () {
			touchElement.removeEventListener( 'touchstart', handleTouchStart, opt );
			touchElement.removeEventListener( 'touchmove', handleTouchMove, opt );
			touchElement.removeEventListener( 'touchend', handleTouchEnd, opt );
			touchElement.removeEventListener( 'touchcancel', handleTouchCancel, opt );
			$( '.OWIDSliderDialog' ).html( '' );
		};

		var $svgContainer = $( '<div class="OWIDSliderSVGContainer"></div>' );
		this.$svgContainer = $svgContainer;

		$svgContainer.on( 'mousewheel', function ( event, delta ) {
			// Scroll is too fast (Esp. on chrome), so we buffer scroll events.
			that.pendingScrollDelta += delta;
			var realDelta = Math.floor( that.pendingScrollDelta / SCROLL_SLOWDOWN );
			if ( delta !== 0 ) {
				// We reverse the direction of scroll.
				that.currentImage -= realDelta > 2 ? 2 : realDelta;
				that.pendingScrollDelta -= realDelta * SCROLL_SLOWDOWN;
				that.repaint();
			}
			return false;
		} );
		let mouse_y;
		$svgContainer.on( 'mousedown', function ( event ) {
			// prepare scroll by drag
			mouse_y = event.screenY; // remember mouse-position
			that.scrollobject = true; // set flag
			return false;
		} );
		$svgContainer.on( 'mouseup', function ( event ) {
			that.scrollobject = false; // set flag
			return false;
		} );
		$svgContainer.on( 'mousemove', function ( event ) {
			if ( that.scrollobject && Math.abs( mouse_y - event.screenY ) > 10 ) {
				var offset = mouse_y < event.screenY ? 1 : -1;
				mouse_y = event.screenY; //  remember mouse-position for next event
				that.currentImage += offset;
				that.repaint();
			}
			return false;
		} );

		this.$credit = $( '<a></a>' );
		this.$credit.text( mw.msg( 'OWIDSliderFrameImageCredit' ) );
		var $creditDiv = $( '<div class="OWIDSliderCredit"></div>' )
			.append( this.$copyLink )
			.append( this.$credit );

		var $select = '';
		if ( Object.keys( this.imgs ).length >= 0 ) {
			$select = $( '<select>' )
				.attr( 'id', 'OWIDSliderViewSelector' )
				.attr( 'class', 'owid-select' );
			for ( let i in this.imgs ) {
				var optionName = i.replace(/([A-Z])/g, ' $1').trim();
				$select.append(
					$( '<option>' )
						.attr( { value: i, selected: this.currentView === i } )
						.text( optionName )
				);
			}
			$select.change( function ( e ) {
				that.currentView = e.target.value;
				that.total = Object.keys( that.imgs[ that.currentView ] ).length;
				that.urlsLoaded = 0;
				that.$loading = that.createLoader();
				that.preload();
				that.loadRegionChartSwitch();
			} );
			var selectContainer = $( '<div>' ).attr( 'class', 'owid-select-container' );
			var selectArrow = $( '<span>' ).attr( 'class', 'owid-select-arrow' );
			var selectLabel = $( '<label>' )
				.attr( 'class', 'owid-select-label' )
				.text( mw.msg( 'OWIDSliderSelectRegion' ) );
			selectContainer.append( $select ).append( selectArrow ).append( selectLabel );
			$select = selectContainer;
		}

		var $container = $( '<div class="OWIDSliderImgContainer"></div>' )
			.append( $select );
		$container.append( $svgContainer )
			.append( $creditDiv )
			.append( this.$sliderContainer );
		this.$countrySelect = $select;
		this.$container = $container;
		this.$svgContainer = $svgContainer;

		this.$viewer.append( $container );
		var $wrapper = false;
		if ( this.captionId ) {
			var captionElm = document.getElementById( this.captionId );
			if ( captionElm && captionElm.innerText !== '' ) {
				var newCaption = $( captionElm ).clone();
				newCaption.show();
				$wrapper = $( '<div class="OWIDSlider-caption"></div>' ).append(
					newCaption
				);
				this.$container.append( $wrapper );
			}
		}

		this.cachedSvgs = Object.create( null );
		this.cachedCountriesSvgs = Object.create( null );

		this.getUrls();
		// this.toggleImg();
		this.preload();
		this.loadRegionChartSwitch();
		if ( this.language && this.language !== 'en' ) {
			this.populateTranslatedCountriesNames();
		}
		this.$slider.focus();
	},
	loadRegionChartSwitch: function() {
		if (this.$regionChartBtnContainer) {
			this.$regionChartBtnContainer.remove();
		}

		this.$regionChartBtnContainer = null;
		if (this.regionsChartsUrls != null && this.regionsChartsUrls[this.currentView]) {
			this.$regionChartBtnContainer = $( '<div>' ).attr( 'class', 'owid-region-chart-container' );
			var regionBtnLabel = mw.msg( 'OWIDSliderShowRegionGraph' );
			var $regionBtn = $( '<button></button>' )
				.attr( {
					type: 'button',
					class: 'OWIDSlider-country-back',
					title: regionBtnLabel,
					'aria-label': regionBtnLabel
				} )
				.text( regionBtnLabel );
			$regionBtn.on(
				'click',
				function () {
					this.loadRegionChart(this.currentView);
					this.$regionChartBtnContainer.remove();
				}.bind( this )
			);
			this.$regionChartBtnContainer.append($regionBtn);
			this.$countrySelect.after(this.$regionChartBtnContainer);
		}
	},
	getMaxImgDim: function () {
		// This assumes that even on high-DPI displays, enlarging to 96dpi is ok.
		var w = this.imgs[ this.viewMin ][ this.min ].width;
		var h = this.imgs[ this.viewMin ][ this.min ].height;
		if ( this.imgs[ this.viewMin ][ this.min ].srcset.match( /\s2x\s*(,|$)/ ) ) {
			w *= 2;
			h *= 2;
		} else if (
			this.imgs[ this.viewMin ][ this.min ].srcset.match( /\s1.5x\s*(,|$)/ )
		) {
			w = Math.floor( 1.5 * w );
			h = Math.floor( 1.5 * h );
		}
		return [ w, h ];
	},

	repaint: function () {
		if ( this.pendingFrame ) {
			return;
		}
		requestAnimationFrame( this.toggleImg.bind( this ) );
	},

	toggleImg: function () {
		this.pendingFrame = true;
		if ( this.prevImage < this.currentImage ) {
			while (
				this.currentImage < this.max &&
        !this.imgs[ this.currentView ][ this.currentImage ]
			) {
				this.currentImage++;
			}
			// If we get to the end and its still not valid
			while (
				this.currentImage > this.min &&
					!this.imgs[ this.currentView ][ this.currentImage ]
			) {
				this.currentImage--;
			}
		} else {
			while (
				this.currentImage > this.min &&
        !this.imgs[ this.currentView ][ this.currentImage ]
			) {
				this.currentImage--;
			}
			while (
				this.currentImage < this.max &&
					!this.imgs[ this.currentView ][ this.currentImage ]
			) {
				this.currentImage++;
			}
		}
		if ( this.loop ) {
			if ( this.currentImage < this.min ) {
				this.currentImage = this.max;
			} else if ( this.currentImage > this.max ) {
				this.currentImage = this.min;
			}
		} else {
			if ( this.currentImage < this.min ) {
				this.currentImage = this.min;
			} else if ( this.currentImage > this.max ) {
				this.currentImage = this.max;
			}
		}
		this.prevImage = this.currentImage;
		this.$slider[ 0 ].value = this.currentImage;
		this.$slider[ 0 ].title = this.currentImage;
		this.$credit[ 0 ].href = this.infoUrls[ this.currentView ][ this.currentImage ];
		if ( this.infoUrls[ this.currentView ][ this.currentImage ] === false ) {
			this.$credit.css( 'visibility', 'hidden' );
		} else {
			this.$credit.css( 'visibility', 'visible' );
		}
		var currentUrl = this.svgUrls[ this.currentView ][ this.currentImage ].url;
		var that = this;

		if ( this.sliderYearPopupTimeout ) {
			clearInterval( this.sliderYearPopupTimeout );
		}
		this.$sliderYearPopup.text( this.currentImage );
		var popupWidth = this.$sliderYearPopup.width() || 35;
		if ( popupWidth > 0 ) {
			var popupLeft =
        ( ( this.currentImage - this.min ) / ( this.max - this.min ) ) * 100;
			var calculatedPopupLeft =
        'calc(' + popupLeft + '% ' + '- ' + ( popupWidth / 2 + 10 ) + 'px)';
			this.$sliderYearPopup
				.css( 'visibility', 'visible' )
				.css( 'left', calculatedPopupLeft );
			this.sliderYearPopupTimeout = setTimeout( function () {
				that.$sliderYearPopup.css( 'visibility', 'hidden' );
				clearTimeout( that.sliderYearPopupTimeout );
			}, 5 * 1000 );
		}

		this.setCurrentSvgImage( currentUrl, function () {
			that.pendingFrame = false;
		} );
	},
	setSvg: function ( $svgEl ) {
		if ( $svgEl[ 0 ] instanceof SVGSVGElement ) {
			// This helps flexbox display properly.
			var width = $svgEl[ 0 ].viewBox.baseVal.width;
			var height = $svgEl[ 0 ].viewBox.baseVal.height;
			if ( width && height && width > 0 && height > 0 ) {
				this.$svgContainer.css( 'aspect-ratio', width + ' / ' + height );
			}
		}
		this.$svgContainer.html( $svgEl );
	},
	setCurrentSvgImage: function ( svgUrl, callback ) {
	// Check for the new flow
	let i, svgEl; // Declare outside the loop
	if ( this.svgYears && this.svgYears[ this.currentView ] && this.svgYears[ this.currentView ][ this.currentImage ] && this.firstSVGData ) {
		svgEl = $( this.firstSVGData );
		var countriesWithData = svgEl.find( '#countries-with-data path,#countries-without-data path' );
		for ( i = 0; i < countriesWithData.length; i++ ) {
			var fill = this.svgYears[ this.currentView ][ this.currentImage ][ countriesWithData[ i ].getAttribute( 'id' ) ];
			if ( fill ) {
				countriesWithData[ i ].setAttribute( 'fill', fill );
			}
		}

		var urlEl = svgEl.find( '#header > a' );
		if ( urlEl.length && urlEl.attr( 'href' ) ) {
			urlEl.attr( 'href', urlEl.attr( 'href' ).replace( this.min, this.currentImage ) );
		}

		var titleEl = svgEl.find( '#header > a text tspan' );
			if ( titleEl ) {
				var titleText = '';
				for ( i = 0; i < titleEl.length; i++ ) {
					titleText += titleEl[ i ].textContent + ' ';
				}
				titleEl.slice( 1 ).remove();
				titleEl.text( titleText.replace( this.min, this.currentImage ) );
		}

		svgEl = this.getScaledSvg( svgEl );
			this.setSvg( svgEl );
		this.attachSVGHandlers();
		callback();
		return;
		}

		if ( this.cachedSvgs[ svgUrl ] ) {
			svgEl = this.getScaledSvg( this.cachedSvgs[ svgUrl ] );
		this.setSvg( svgEl );
			this.attachSVGHandlers();
			callback();
			return;
		}
		var that = this;
		fetch( svgUrl )
			.then( function ( resp ) {
				return resp.text();
			} )
			.then( function ( svgData ) {
				// We use SVG in an HTML not XML content, so we need to resanitize
				svgData = OWIDSlider.purify( svgData );
				that.cachedSvgs[ svgUrl ] = svgData;
				var svgEl = that.getScaledSvg( svgData );
				that.setSvg( svgEl );
				that.attachSVGHandlers();
				callback();
			} )
			.catch( function ( err ) {
				console.log( 'Error loading image', err );
			} );
	},
	getScaledSvg: function ( content ) {
		var svgEl = $( content );
		// If the svg content has comment, it's treated as a separate node
		// So we need to extract just the svg
		if ( svgEl.length > 1 ) {
		for ( let i = 0; i < svgEl.length; i++ ) {
		if ( svgEl[ i ].tagName === 'svg' ) {
		svgEl = $( svgEl[ i ] );
		break;
		}
		}
		}

		if (
			!svgEl.attr( 'viewBox' ) &&
			svgEl.attr( 'width' ) &&
			svgEl.attr( 'width' ).match( /^\d+(px)?$/ ) &&
			svgEl.attr( 'height' ) &&
			svgEl.attr( 'height' ).match( /^\d+(px)?$/ )
		) {
			// If no viewbox but have width & height, make one so that we can properly resize image
			svgEl.attr( 'viewBox', '0 0 ' + parseInt( svgEl.attr( 'width' ) ) + ' ' + parseInt( svgEl.attr( 'height' ) ) );
		}
		svgEl.removeAttr( 'width' );
		svgEl.removeAttr( 'height' );
		var windowWidth = window.outerWidth;
		// var isMobile = windowWidth < 600; /* eslint no-unused var*/
		// if (isMobile) {
		// 	svgEl.attr("width", "100%");
		// } else {
		// 	svgEl.attr("height", "70vh");
		// }
		svgEl.css( 'max-width', '100%' ).css( 'max-height', '70vh' );
		// Update the viewBox
		var viewBox = svgEl.attr( 'viewBox' );
		if ( viewBox && viewBox.match( /^0 0 850 / ) ) {
		var parts = viewBox.trim().split( ' ' );
			// FIXME, is this just hardcoding the normal size of the OWID files? That seems very fragile.
		parts[ 3 ] = '550';
		svgEl.attr( 'viewBox', parts.join( ' ' ) );
		}
		return svgEl;
	},
	getInfoIcon: function () {
		// Original at https://commons.wikimedia.org/wiki/File:Information_icon.svg
		var $icon = $(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62" width="25" height="25" version="1.0"><defs><linearGradient id="fieldGradient" gradientUnits="userSpaceOnUse" x1="42.9863" y1="7.01270" x2="22.0144" y2="51.9871"><stop offset="0.0" stop-color="#BCD6FE" /><stop offset="1.0" stop-color="#6787D3" /></linearGradient><linearGradient id="edgeGradient" gradientUnits="userSpaceOnUse" x1="55.4541" y1="42.7529" x2="9.54710" y2="16.2485"><stop offset="0.0" stop-color="#3057A7" /><stop offset="1.0" stop-color="#5A7AC6" /></linearGradient><radialGradient id="shadowGradient"><stop offset="0.0" stop-color="#C0C0C0" /><stop offset="0.88" stop-color="#C0C0C0" /><stop offset="1.0" stop-color="#C0C0C0" stop-opacity="0.0" /></radialGradient></defs><circle id="shadow" r="26.5" cy="29.5" cx="32.5" fill="url(#shadowGradient)" transform="matrix(1.0648,0.0,0.0,1.064822,-2.1,1.0864)" /><circle id="field" r="25.8" cx="31" cy="31" fill="url(#fieldGradient)" stroke="url(#edgeGradient)" stroke-width="2" /><g id="info" fill="white"><polygon points="23,25 35,25 35,44 39,44 39,48 23,48 23,44 27,44 27,28 23,28 23,25" /><circle r="4" cx="31" cy="17" /></g></svg>'
		);
		if ( window.outerWidth < 600 ) {
		$icon.attr( 'width', '50px' );
		$icon.attr( 'height', '50px' );
		}
		return $icon;
	},
	attachDetailsToInfoIcon: function ( svgEl ) {
		var footer = svgEl.find( '#footer' );
		var separator = svgEl.find( '#separator-line' );
		var details = svgEl.find( '#details' );
		// Remove unneeded elements
		if ( separator.length ) {
			separator.remove();
		}
		if ( details.length ) {
			details.remove();
		}
		if ( footer.length ) {
		footer.remove();
		}
		var detailsArr = [];
		if ( this.worldDetails ) {
		detailsArr = this.parseSVGDetails( $( this.worldDetails ) );
		} else {
			detailsArr = this.parseSVGDetails( details );
		}
		var header = svgEl.find( '#header' );
		var isMobile = window.outerWidth < 600;
		if ( header.length && detailsArr ) {
			header = header.first();
			// var that = this; /* eslint no-unused var*/
			var infoIcon = this.getInfoIcon();
			svgEl.find( '#logo' ).empty().append( infoIcon );
			infoIcon.css( 'cursor', 'pointer' );
			infoIcon.on( 'mouseleave', function ( e ) {
				$( '#details-popup.owid-details-hover' ).remove();
			} );
			infoIcon.on( 'click' + ( !isMobile ? ' mouseenter' : '' ), function ( e ) {
				// Prevent click/tap from bubbling to underlying UI (fixes mobile taps opening the region selector)
				e.stopPropagation();
				if ( e.type === 'click' ) {
					e.preventDefault();
				}
				// Close old popup if it is currently open.
				var oldPopup = $( '#details-popup' );
				// If its a hover don't close old popup or open a new one if popup already exists.
				if ( oldPopup.length && e.type === 'mouseenter' ) {
					return;
				}
				oldPopup.remove();
				var popup = $( '<div>' )
					.css( 'position', 'absolute' )
					.css( 'background-color', 'white' )
					.css( 'color', 'black' )
					.css( 'border', '1px solid #eee' )
					.css( 'border-radius', '2px' )
					.css( 'padding', '5px' )
					.css( 'max-width', '400px' )
					.attr( 'id', 'details-popup' )
					.attr( 'class', e.type === 'mouseenter' ? 'owid-details-hover' : 'owid-details-click' );
				if ( e.type === 'click' ) {
					var close = $( '<button>' ).text( 'X' ).css( 'cursor', 'pointer' ).on( 'click', function () {
			$( '#details-popup' ).remove();
		} );
			var closeContainer = $( '<div>' ).css( 'text-align', 'right' ).append( close );
			popup.append( closeContainer );
				}
				if ( isMobile ) {
			popup.css( 'top', '0px' ).css( 'right', '25px' ).css( 'max-width', '350px' );
				} else {
			popup.css( 'top', parseInt( e.clientY ) + 15 + 'px' ).css( 'left', parseInt( e.clientX ) - 400 + 'px' );
				}
				detailsArr.forEach( function ( item ) {
					var itemContainer = $( '<div>' ).css( 'font-size', '12px' );
					var title = $( '<strong>' ).text( item.id + '. ' + item.title + ': ' );
					var description = $( '<span>' ).text( item.description );
					itemContainer.append( title ).append( description );
					popup.append( itemContainer );
				} );
				$( '.OWIDSlider-viewer' ).append( popup );
			} );
		}
	},
	parseSVGDetails: function ( svgDetails ) {
		if ( svgDetails.length > 0 ) {
			var items = svgDetails.children();
			var details = [];
			items.each( function () {
				// Get all tspan elements in this text group
				const tspans = $( this ).find( 'tspan' );

				// Extract the first line which contains the number and title
				const firstLine = tspans.first().text();

				// Try to match pattern with colon first: "1. Title: Description"
				var titleMatch = firstLine.match( /^(\d+)\.\s+([^:]+):\s*(.*)/ );
				var number, title, firstLineContent;
				if ( titleMatch ) {
					// Pattern with colon found
					number = parseInt( titleMatch[ 1 ] );
					title = titleMatch[ 2 ].trim();
					firstLineContent = titleMatch[ 3 ].trim();
				} else {
					// Try pattern without colon: "1. Title Description"
					titleMatch = firstLine.match( /^(\d+)\.\s+(.+)/ );
					if ( titleMatch ) {
						number = parseInt( titleMatch[ 1 ] );
						// For titles without colon, we need to extract the title from the styled spans
						const titleSpan = tspans.first().find( 'tspan[style*="font-weight:700"]' ).last();
						if ( titleSpan.length > 0 ) {
							title = titleSpan.text().trim();
							// Get content after the title
							const titleEndIndex = firstLine.indexOf( title ) + title.length;
							firstLineContent = firstLine.slice( Math.max( 0, titleEndIndex ) ).trim();
						} else {
							// Fallback: assume first few words are the title
							const words = titleMatch[ 2 ].trim().split( ' ' );
							title = words.slice( 0, 2 ).join( ' ' ); // Take first 2 words as title
							firstLineContent = words.slice( 2 ).join( ' ' ); // Rest as description
						}
					}
				}

				if ( number && title ) {
					// Get additional content from subsequent tspans (exclude the repeated title/number)
					var additionalContent = '';
					tspans.slice( 1 ).each( function () {
						// Exclude content that starts with the number and title again
						const text = $( this ).text();
						if ( !text.match( /^\d+\.\s+/ ) ) {
							additionalContent += ' ' + text.trim();
						}
					} );

					// Combine for full description
					const fullDescription = ( firstLineContent + additionalContent ).trim();

					// Add to JSON structure
					details.push( {
						id: number,
						title: title,
						description: fullDescription
					} );
				}
			} );
		}
		return details;
	},
	attachSVGHandlers: function () {
		this.initSVGControls();
	},
	replaceTranslationData: function ( svgDoc ) {
		if ( this.worldTitle ) {
		var currentTitle = svgDoc.querySelector( '#header a text tspan' );
		if ( currentTitle ) {
			currentTitle.textContent = this.worldTitle;
		}
		}
		if ( this.worldSubtitle ) {
		var currentSubtitle = svgDoc.querySelector( '#header #subtitle text tspan' );
		if ( currentSubtitle ) {
			currentSubtitle.textContent = this.worldSubtitle;
		}
		}

		if ( this.worldDetails ) {
			var currentDetails = svgDoc.querySelector( '#details' );
		if ( currentDetails ) {
			currentDetails.replaceWith( this.worldDetails );
		}
		}
		if ( this.worldLabels ) {
		var currentLabels = svgDoc.querySelector( '#labels' );
		if ( currentLabels ) {
			currentLabels.replaceWith( this.worldLabels );
		}
		}

		return svgDoc;
	},
	preload: function () {
		var that = this;
		// var funcArray = []; /* eslint no-unused var*/
		if ( !this.svgYears ) {
			this.svgYears = Object.create( null );
		}

		var svgs = [];
		var viewSvgs = this.svgUrls[ this.currentView ];
		var firstSvg = viewSvgs[ this.min ];
		fetch( firstSvg.url )
			.then( function ( res ) {
				return res.text();
			} )
			.then( function ( svgData ) {
		// We need to extract the years first, cause DOMPurify removes the years metadata
		var parser = new DOMParser();
		var svgDoc = parser.parseFromString( svgData, 'image/svg+xml' );
		var years = svgDoc.querySelectorAll( 'metadata years year' );

		// Then let's purify
		svgData = OWIDSlider.purify( svgData );
		svgData = svgData.replaceAll( '&nbsp;', '' );

		parser = new DOMParser();
		svgDoc = parser.parseFromString( svgData, 'image/svg+xml' );
		if ( years.length > 0 ) {
			var yearsObj = Object.create( null );
			years.forEach( function ( yearEl ) {
				var year = parseInt( yearEl.getAttribute( 'value' ) );
			yearsObj[ year ] = Object.create( null );
			for ( let i = 0; i < yearEl.children.length; i++ ) {
			var countryEl = yearEl.children[ i ];
				yearsObj[ year ][ countryEl.getAttribute( 'name' ).replace( /\s/g, '-' ) ] = countryEl.getAttribute( 'fill' );
			}
			} );
		that.firstSVGData = svgData;

		// Remove language switches
		var switches = svgDoc.querySelectorAll( 'switch' );
				switches.forEach( function ( sw ) {
					var enOption = null;
					sw.querySelectorAll( 'text' ).forEach( function ( text ) {
						var sysLang = text.getAttribute( 'systemLanguage' );
						if ( !sysLang || sysLang === 'en' ) {
							enOption = text;
						}
					if ( that.language && that.language !== 'en' ) {
						if ( sysLang !== that.language ) {
							sw.removeChild( text );
						} else {
							text.removeAttribute( 'systemLanguage' );
						}
					} else {
						// It's English
						if ( sysLang && sysLang !== 'en' ) {
							sw.removeChild( text );
					}
					}
				} );
				// Fallback to English if no translation to target language is found
				if ( sw.children.length === 0 && enOption ) {
					sw.appendChild( enOption );
				}
				} );

			// preserve the translations from the World map
			if ( that.currentView.toLowerCase() === 'world' || ( switches.length > 0 && !that.worldTitle ) ) {
						that.worldTitle = svgDoc.querySelector( '#header a text tspan' ) ? svgDoc.querySelector( '#header a text tspan' ).textContent : '';
						that.worldSubtitle = svgDoc.querySelector( '#header #subtitle text tspan' ) ? svgDoc.querySelector( '#header #subtitle text tspan' ).textContent : '';
				that.worldDetails = svgDoc.querySelector( '#details' );
				that.worldLabels = svgDoc.querySelector( '#labels' );
			} else {
				// Check if we have world translations. If so, substitute in the svgDoc
				svgDoc = that.replaceTranslationData( svgDoc );
			}

			// Convert the modified DOM back to a string
			var serializer = new XMLSerializer();
			that.firstSVGData = serializer.serializeToString( svgDoc );
			that.svgYears[ that.currentView ] = yearsObj;
			that.toggleImg();
			that.removeLoadingState();
	} else {
			// TODO: Ask user to import or fallback to prev flow
			for ( let i = that.min; i <= that.max; i++ ) {
				var svgUrl = that.svgUrls[ that.currentView ][ i ];
				if ( svgUrl ) {
					svgUrl = svgUrl.url;
				} else {
					continue;
				}
					// Previousely cached
				if ( that.cachedSvgs[ svgUrl ] ) {
					continue;
				}
				svgs.push( svgUrl );
			}
			that.processArray( svgs, that.loadAndCacheSvgs.bind( that ) );
			that.toggleImg();
	}
			} );

	},
	loadAndCacheSvgs: function ( svgUrl ) {
		var that = this;
		return new Promise( function ( resolve ) {
			fetch( svgUrl )
				.then( function ( res ) {
					return res.text();
				} )
				.then( function ( svgData ) {
					svgData = OWIDSlider.purify( svgData );

					that.cachedSvgs[ svgUrl ] = svgData;
					that.onUrlLoaded();
					resolve( true );
				} )
				.catch( function ( err ) {
					that.onUrlLoaded();
					console.log( 'Error loading svg data', svgUrl, err );
					resolve( false );
				} );
		} );
	},
	processArray: function ( arr, fn ) {
		var chunks = [];

		var chunk_size = 2;
		var accumulator = [];
		for ( let i = 0; i < arr.length; i++ ) {
			if ( accumulator.length >= chunk_size ) {
				chunks.push( accumulator );
				accumulator = [];
			}
			accumulator.push( arr[ i ] );
		}
		if ( accumulator.length > 0 ) {
			chunks.push( accumulator );
			accumulator = [];
		}

		return chunks.reduce( function ( p, v ) {
			return p.then( function ( a ) {
				return new Promise( function ( resolve ) {
					if ( !v || v.length === 0 ) {
						return resolve( p );
					}
					var funcArray = [];
					for ( let i = 0; i < v.length; i++ ) {
						funcArray.push(
							( function ( url ) {
								return fn( url ).then( function ( r ) {
									return a.concat( [ r ] );
								} );
							} )( v[ i ] )
						);
					}
					return Promise.all( funcArray ).then( function () {
						resolve( a );
					} );
				} );
			} );
		}, Promise.resolve( [] ) );
	},

	getUrls: function () {
		this.urls = Object.create( null );
		this.infoUrls = Object.create( null );
		for ( let gallery in this.imgs ) {
			this.urls[ gallery ] = [];
			this.infoUrls[ gallery ] = [];
			for ( let i = this.min; i <= this.max; i++ ) {
				if ( !this.imgs[ gallery ][ i ] ) {
					continue;
				}
				this.urls[ gallery ][ i ] = OWIDSlider.getSource(
					this.imgs[ gallery ][ i ],
					this.width,
					this.height
				);
				if ( this.imgs[ gallery ][ i ].parentElement.href ) {
					this.infoUrls[ gallery ][ i ] = this.imgs[ gallery ][ i ].parentElement.href;
				} else {
					this.infoUrls[ gallery ][ i ] = false;
				}
			}
		}
	},

	onUrlLoaded: function () {
		// For now, this still increments for failed loads, so
		// as not to have the progress bar stuck.
		this.urlsLoaded++;
		var progress = Math.floor( ( this.urlsLoaded / this.total ) * 100 );
		if ( this.$loading.length ) {
			this.$loading.text( mw.msg( 'OWIDSliderLoading', progress ) );
			if ( this.urlsLoaded === this.total ) {
				this.removeLoadingState();
			}
		}
	},

	removeLoadingState: function () {
		this.urlsLoaded = this.total;
		this.$viewer.removeClass( 'OWIDSlider-loading' );
		this.$loading.remove();
	},

	handleTouchStart: function ( e ) {
		for ( let i = 0; i < e.changedTouches.length; i++ ) {
			var t = e.changedTouches[ i ];
			this.pendingTouches[ t.identifier ] = [ t.clientX, t.clientY ];
		}
	},
	handleTouchCancel: function ( e ) {
		for ( let i = 0; i < e.changedTouches.length; i++ ) {
			var t = e.changedTouches[ i ];
			delete this.pendingTouches[ t.identifier ];
		}
	},
	handleTouchMove: function ( e ) {
		for ( let i = 0; i < e.changedTouches.length; i++ ) {
			var t = e.changedTouches[ i ];
			if ( !this.pendingTouches[ t.identifier ] ) {
				continue;
			}
			var startX = this.pendingTouches[ t.identifier ][ 0 ];
			var startY = this.pendingTouches[ t.identifier ][ 1 ];
			var angle = Math.abs(
				Math.atan( ( startY - t.clientY ) / ( startX - t.clientX ) )
			);

			if ( angle > 1 ) {
				// vertical. > ~60 degrees
				if ( Math.abs( startY - t.clientY ) < 15 ) {
					// Not large enough
					continue;
				}
				// reset calculation so we move image if they move 15 more pixels
				this.pendingTouches[ t.identifier ] = [ t.clientX, t.clientY ];
				/* Do not do anything for vertical swipes.
				if ( startY - t.clientY > 0 ) {
				// swipe up
				this.currentImage--;
				this.repaint();
				} else {
				// swipe down.
				this.currentImage++;
				this.repaint();
				}
			*/
			}
		}
	},
	handleTouchEnd: function ( e ) {
		for ( let i = 0; i < e.changedTouches.length; i++ ) {
			var t = e.changedTouches[ i ];
			if ( !this.pendingTouches[ t.identifier ] ) {
				continue;
			}
			var startX = this.pendingTouches[ t.identifier ][ 0 ];
			var startY = this.pendingTouches[ t.identifier ][ 1 ];
			var angle = Math.abs(
				Math.atan( ( startY - t.clientY ) / ( startX - t.clientX ) )
			);
			if ( angle < 0.7 ) {
				// horizontal swipe. < 40 degrees
				if ( Math.abs( startX - t.clientX ) < 30 ) {
					// Not large enough
					continue;
				}

				if ( startX - t.clientX < 0 ) {
					// swipe left
					this.currentImage--;
					this.repaint();
				} else {
					// swipe right
					this.currentImage++;
					this.repaint();
				}
			}
			/**
			 * do not do anything for vertical swipes
			 * if ( angle > 1 ) {
			 * // vertical swipe. > ~60 degrees
			 * if ( Math.abs( startY - t.clientY ) < 30 ) {
			 * // Not large enough
			 * continue;
			 * }
			 * if ( startY - t.clientY > 0 ) {
			 * // swipe up
			 * this.currentImage--;
			 * this.repaint();
			 * } else {
			 * // swipe down
				this.currentImage++;
				this.repaint();
				}
			}
			 */

			delete this.pendingTouches[ t.identifier ];
		}
	},
	loadRegionChart: function (region) {
		var url = this.regionsChartsUrls[ region ];
		if ( url ) {
			if ( this.cachedCountriesSvgs[ url ] ) {
				this.paintCountryChart( this.cachedCountriesSvgs[ url ] );
				this.$credit[ 0 ].href = this.regionsChartsInfoUrls[ region ];
			} else {
				var that = this;
				this.originalContainerContent = this.$svgContainer.html();
				this.$svgContainer.html( this.$loader.html() );
				fetch( url )
					.then( function ( data ) {
						return data.text();
					} )
					.then( function ( content ) {
						content = OWIDSlider.purify( content );
						that.cachedCountriesSvgs[ url ] = content;
						that.setSvg( that.originalContainerContent );
						that.paintCountryChart( content );
			that.$credit[ 0 ].href = that.regionsChartsInfoUrls[ region ];
					} )
					.catch( function ( err ) {
						console.log( 'Error getting country svg', err );
					} );
			}
		} else {
			// Country not imported
			this.paintCountryChart( this.getCountryNotFound() );
		}
	},
	initSVGControls: function ( countriesUrls ) {
		this.HIGHLIGHTED_STROKE_WIDTH = 1;
		this.DEFAULT_STROKE_WIDTH = 0.3;
		this.CONTAINER_SELECTOR = '.OWIDSliderSVGContainer';
		this.MAP_SELECTOR = '#chart-area';
		this.$svgContainer = $( this.CONTAINER_SELECTOR );
		this.strokeWidth = Object.create( null );
		this.originalContainerContent = this.$svgContainer.html();
		// Enable pointer events on svg content
		this.chartArea = document.querySelector(
			this.CONTAINER_SELECTOR + ' #chart-area'
		);
		this.chartArea.style.pointerEvents = 'all';
		this.chartArea.style.zIndex = 1;
		this.$loader = this.getLoader();
		var svgBackgroundFill = $( this.CONTAINER_SELECTOR + ' .background-fill' );
		if ( svgBackgroundFill ) {
			svgBackgroundFill.css( 'z-index', -1 );
		}
		var $countryBack = $( '.OWIDSlider-country-back-container' );
		if ( $countryBack.length ) {
			$countryBack.remove();
		}
		this.attacHoverEventOnCountries();
		this.attachFocusCountriesOnLegendHover();
		this.attachClickEventOnCountries();
		this.attachDetailsToInfoIcon( $( this.CONTAINER_SELECTOR + ' > svg' ) );
		// attachBackButton();
	},

	getLoader: function () {
		var $loader = $( '<div></div>' ).attr( {
			class: 'OWIDSlider-viewer OWIDSlider-loading'
		} );
		// From https://commons.wikimedia.org/wiki/File:Loading_spinner.svg
		$loader.append(
			'<svg xmlns="http://www.w3.org/2000/svg" aria-label="Loading..." viewBox="0 0 100 100" width="25%" height="25%" style="display:block;margin:auto"><rect fill="#555" height="6" opacity=".083" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".167" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".25" rx="3" ry="3" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".417" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".583" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".667" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".833" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"/><rect fill="#555" height="6" opacity=".917" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"/></svg>'
		);
		return $loader;
	},

	attacHoverEventOnCountries: function () {
		// attach hover event on all countries
		var allCountries = document.querySelectorAll(
			this.CONTAINER_SELECTOR +
		' g#countries-with-data path,g#countries-without-data path'
		);

		for ( let i = 0; i < allCountries.length; i++ ) {
			allCountries[ i ].onmouseenter = this.onCountryHover.bind( this );
			allCountries[ i ].onmouseleave = this.onCountryHoverLeave.bind( this );
			allCountries[ i ].style.cursor = 'pointer';
		}
	},
	getOverlayHanlderId: function ( id ) {
		return 'overlay-' + id;
	},
	onCountryHover: function ( e ) {
		function createCountryPopup( config ) {
			var countryPopup = document.createElement( 'div' );
			countryPopup.style.position = 'absolute';
			countryPopup.style.left = config.left;
			countryPopup.style.top = config.top;
			countryPopup.style.backgroundColor = 'white';
			countryPopup.style.color = 'black';
			countryPopup.style.border = '1px solid #eee';
			countryPopup.style.borderRadius = '2px';
			countryPopup.style.boxShadow = '2px 2px 2px 1px #888888';
			countryPopup.style.padding = '5px';
			var span = document.createElement( 'span' );
			span.textContent = config.name;
			countryPopup.appendChild( span );
			countryPopup.id = config.id;
			return countryPopup;
		}

		var id = e.target.getAttribute( 'id' );
		this.strokeWidth[ id ] = e.target.getAttribute( 'stroke-width' );
		e.target.setAttribute( 'stroke-width', this.HIGHLIGHTED_STROKE_WIDTH );
		var name = id;
		var formattedName = name.toLowerCase().replace( /[^a-z0-9]/g, '' );
		if ( this.translatedCountryNames[ formattedName ] ) {
			name = this.translatedCountryNames[ formattedName ];
		}
		var countryPopup = createCountryPopup( {
			id: this.getOverlayHanlderId( id ),
			name: name,
			left: parseInt( e.clientX ) + 15 + 'px',
			top: parseInt( e.clientY ) + 15 + 'px'
		} );
		document.querySelector( this.CONTAINER_SELECTOR ).appendChild( countryPopup );
	},
	onCountryHoverLeave: function ( e ) {
		var id = e.target.getAttribute( 'id' );
		e.target.setAttribute(
			'stroke-width',
			this.strokeWidth[ id ] || this.DEFAULT_STROKE_WIDTH
		);
		var el = document.querySelector( this.CONTAINER_SELECTOR );
		var overlayEl = document.getElementById( this.getOverlayHanlderId( id ) );
		if ( el && overlayEl ) {
			el.removeChild( overlayEl );
		}
	},
	attachFocusCountriesOnLegendHover: function () {
		// Focusing coutries on legend hover
		var swatchsStrokeWidth = Object.create( null );
		function onSwatchMouseEnter( e ) {
			var fill = e.target.getAttribute( 'fill' );
			var elementsSelector = this.CONTAINER_SELECTOR + ' ' + this.MAP_SELECTOR + " path[fill]:not([fill='" + fill + "'])";
			var elements = document.querySelectorAll( elementsSelector );
			for ( let i = 0; i < elements.length; i++ ) {
		if ( elements[ i ].parentElement && elements[ i ].parentElement.id === 'swatches' ) {
		continue;
		}
				elements[ i ].setAttribute( 'fill-opacity', '0.1' );
			}
			var targetElements = document.querySelectorAll(
				this.CONTAINER_SELECTOR + ' ' + this.MAP_SELECTOR + " path[fill='" + fill + "']"
			);
			for ( let i = 0; i < targetElements.length; i++ ) {
				var id = targetElements[ i ].getAttribute( 'id' );
				var strokeWidth = targetElements[ i ].getAttribute( 'stroke-width' );
				swatchsStrokeWidth[ id ] = strokeWidth;
				targetElements[ i ].setAttribute(
					'stroke-width',
					this.HIGHLIGHTED_STROKE_WIDTH
				);
			}
			e.target.setAttribute(
				'stroke-width',
				this.HIGHLIGHTED_STROKE_WIDTH * 1.5
			);
			e.target.style.cursor = 'pointer';
		}

		function onSwatchMouseLeave( e ) {
			var fill = e.target.getAttribute( 'fill' );
			var elements = document.querySelectorAll(
				this.CONTAINER_SELECTOR + ' ' + this.MAP_SELECTOR + " path[fill]:not([fill='" + fill + "'])"
			);
			for ( let i = 0; i < elements.length; i++ ) {
				elements[ i ].setAttribute( 'fill-opacity', '1' );
				let id = elements[ i ].getAttribute( 'id' );
				let strokeWidth = swatchsStrokeWidth[ id ] || this.DEFAULT_STROKE_WIDTH;
				elements[ i ].setAttribute( 'stroke-width', strokeWidth );
			}
			var targetElements = document.querySelectorAll(
				this.CONTAINER_SELECTOR + ' ' + this.MAP_SELECTOR + " path[fill='" + fill + "']"
			);
			for ( let i = 0; i < targetElements.length; i++ ) {
				let id = targetElements[ i ].getAttribute( 'id' );
				let strokeWidth = swatchsStrokeWidth[ id ] || this.DEFAULT_STROKE_WIDTH;
				targetElements[ i ].setAttribute( 'stroke-width', strokeWidth );
			}
			e.target.setAttribute( 'stroke-width', this.DEFAULT_STROKE_WIDTH );
		}

		var swatches = document.querySelectorAll(
			this.CONTAINER_SELECTOR + ' #swatches > *'
		);
		for ( let i = 0; i < swatches.length; i++ ) {
			var fill = swatches[ i ].getAttribute( 'fill' );
			if ( !fill || ( fill.indexOf( '#' ) !== 0 && fill.indexOf( 'rgb' ) !== 0 ) ) {
				continue;
			}
			swatches[ i ].onmouseenter = onSwatchMouseEnter.bind( this );
			swatches[ i ].onmouseleave = onSwatchMouseLeave.bind( this );
		}
	},

	attachClickEventOnCountries: function () {
		document.querySelector( this.CONTAINER_SELECTOR + ' ' + this.MAP_SELECTOR ).onclick =
		function ( e ) {
		var target = e.target;
		if ( target.tagName !== 'path' || !target.getAttribute( 'id' ) ) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		var clickedId = target.getAttribute( 'id' );
		var clickedCountryCode = OWIDSlider.OWID_COUNTRY_CODES[ clickedId ];
		if ( clickedCountryCode ) {
			this.onCountryHoverLeave( e );
			this.loadCountryChart( clickedCountryCode );
		}
		}.bind( this );
	},

	loadCountryChart: function ( countryCode ) {
		var url = this.countriesSvgUrls[ countryCode ];
		if ( url ) {
			if ( this.cachedCountriesSvgs[ url ] ) {
				this.paintCountryChart( this.cachedCountriesSvgs[ url ] );
				this.$credit[ 0 ].href = this.countriesInfoUrls[ countryCode ];
			} else {
				var that = this;
				this.originalContainerContent = this.$svgContainer.html();
				this.$svgContainer.html( this.$loader.html() );
				fetch( url )
					.then( function ( data ) {
						return data.text();
					} )
					.then( function ( content ) {
						content = OWIDSlider.purify( content );
						that.cachedCountriesSvgs[ url ] = content;
						that.setSvg( that.originalContainerContent );
						that.paintCountryChart( content );
			that.$credit[ 0 ].href = that.countriesInfoUrls[ countryCode ];
					} )
					.catch( function ( err ) {
						console.log( 'Error getting country svg', err );
					} );
			}
		} else {
			// Country not imported
			this.paintCountryChart( this.getCountryNotFound() );
		}
	},
	getCountryNotFound: function () {
	// Fixme this link doesn't work because the scaledContent event handler blocks it.
		var $viewer = $(
			'<div><p width="850">Country chart not found. You can import it from <a href="https://owidimporter.toolforge.org/" target="_blank" rel="noopener">here</a></p></div>.'
		);
		return $viewer;
	},
	populateTranslatedCountriesNames: function () {
		var countryIds = Object.values( OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP );
		var that = this;
		const chunkSize = 45;
		const chunks = [];

		// Split countryIds into chunks
		for ( let i = 0; i < countryIds.length; i += chunkSize ) {
			chunks.push( countryIds.slice( i, i + chunkSize ) );
		}

		// Process all chunks in parallel with staggered delays
		const chunkPromises = chunks.map( function ( chunk, index ) {
			// Stagger the requests slightly to avoid overwhelming the server
			const delay = index * 50; // 50ms between each chunk start

			return new Promise( function ( resolve ) {
				return setTimeout( resolve, delay );
			} ).then( function () {
				const ids = chunk.join( '|' );
				// const url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + ids + '&format=json&props=labels&languages=' + that.language; /* eslint no-unused var */
				var api = new mw.Api( {
					userAgent: 'OWIDSlider',
					ajax: {
						url: 'https://www.wikidata.org/w/api.php'
					}
				} );

				return api.get( {
					action: 'wbgetentities',
					ids: ids,
					format: 'json',
					languages: that.language,
					props: 'labels',
					origin: '*', // This helps with CORS
					maxage: 24 * 60 * 60, // Cache the results. They shouldn't change.
					smaxage: 60 * 60
				} ).then( function ( res ) {
					const chunkResults = {};
					Object.entries( res.entities ).forEach( function ( [ id, entity ] ) {
						chunkResults[ id ] = entity.labels || {};
					} );
					return chunkResults;
				} ).catch( function ( error ) {
					console.error( 'Error fetching labels for chunk:', error );
					return {}; // Return empty object if this chunk fails
				} );
			} );
		} );

		// Wait for all chunks to complete and merge results
		return Promise.all( chunkPromises ).then( function ( allChunkResults ) {
			// Merge all chunk results into a single object
			const accumResults = allChunkResults.reduce( function ( acc, chunkResult ) {
				return Object.assign( acc, chunkResult );
			}, {} );

			// Process the accumulated results
			Object.entries( accumResults ).forEach( function ( entry ) {
				if ( entry[ 1 ][ that.language ] ) {
					var name = OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP_REVERSE[ entry[ 0 ] ];
					name = name.toLowerCase().replace( /[^a-z0-9]/g, '' );
					that.translatedCountryNames[ name ] = entry[ 1 ][ that.language ].value;
				}
			} );
			that.toggleImg();

			return accumResults;
		} ).catch( function ( error ) {
			console.error( 'Error processing translation chunks:', error );
			return null;
		} );
	},
	getTranslatedCountryName: function ( language, name ) {
	var that = this;
	return new Promise( function ( resolve, reject ) {
		if ( !language || !name ) {
			return reject( 'Missing language or name' );
		}
		name = name.toLowerCase().replace( /[^a-z0-9]/g, '' );
		if ( !OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP[ name ] ) {
			return reject( 'Cannot find country name in WIKIDATA ID Map: ' + name );
		}
		if ( that.translatedCountryNames[ name ] ) {
			return resolve( that.translatedCountryNames[ name ] );
		}

		var countryCode = OWIDSlider.OWID_WIKIDATA_COUNTRY_MAP[ name ];
		var url = 'https://www.wikidata.org/w/rest.php/wikibase/v1/entities/items/' + countryCode + '/labels';
		fetch( url, {
			headers: {
				accept: 'application/json'
				}
		} )
			.then( function ( response ) {
			return response.json();
			} )
			.then( function ( map ) {
			if ( map && map[ language ] ) {
				that.translatedCountryNames[ name ] = map[ language ];
				return resolve( map[ language ] );
			}
				return resolve( '' );
			} )
			.catch( function ( err ) {
			console.log( 'Error getting translated country', err );
			reject( err );
			} );
		} );
	},
	paintCountryChart: function ( content ) {
		this.originalContainerContent = this.$svgContainer.html();
		this.$countrySelect.css( 'display', 'none' );
		var scaledContent = this.getScaledSvg( content );

		if ( scaledContent.length > 0 ) {
			var headerSpan = scaledContent.find( '#header a text tspan' );
			if ( headerSpan.length > 0 ) {
			// Delete all but the first one
				headerSpan.slice( 1 ).remove();
				// Remove the trailing ", $YEAR" from the title if found
		if ( this.worldTitle ) {
			var titleParts = this.worldTitle.split( ',' );
			if ( titleParts.length > 1 ) {
				titleParts.pop();
				}
		headerSpan.text( titleParts.join( ',' ) );
			}
		}

			if ( this.worldSubtitle ) {
		var subtitleSpan = scaledContent.find( '#subtitle text tspan' );
				subtitleSpan.slice( 1 ).remove();
			if ( subtitleSpan.length > 0 ) {
			subtitleSpan.text( this.worldSubtitle );
		}
			}
			if ( this.worldDetails ) {
			var currentDetails = scaledContent.find( '#details' );
			if ( currentDetails.length > 0 ) {
				currentDetails[ 0 ].replaceWith( this.worldDetails );
			}
		}

		// Handle translation
		if ( this.language && this.language !== 'en' ) {
			var countryLabel = scaledContent.find( '#text-labels text tspan' );
			var that = this;
			if ( countryLabel.length > 0 ) {
				var countryName = countryLabel[ 0 ].textContent;
				this.getTranslatedCountryName( this.language, countryName )
				.then( function ( translatedName ) {
				if ( translatedName ) {
					countryLabel[ 0 ].textContent = translatedName;
				}

				that.applyCountryChartPaint( scaledContent );
				} )
				.catch( function ( err ) {
					console.log( 'Error getting translated country name: ', err );
				that.applyCountryChartPaint( scaledContent );
						} );
					return;
			}
			}
		}
		this.applyCountryChartPaint( scaledContent );
	},
	applyCountryChartPaint: function ( scaledContent ) {
		scaledContent.on( 'click', function ( e ) {
			e.preventDefault();
			e.stopPropagation();
		} );
		this.$svgContainer.html( '' ).append( scaledContent );

		// Back content
		var backLabel = mw.msg( 'OWIDSliderFrameBack' );
		var $back = $( '<button></button>' )
			.attr( {
				type: 'button',
				class: 'OWIDSlider-country-back',
				title: backLabel,
				'aria-label': backLabel
			} )
			.text( backLabel );
		var $backContainer = $( '<div></div>' )
			.attr( { class: 'OWIDSlider-country-back-container' } )
			.append( $back );
		$backContainer.css( 'margin-top', '10px' );
		$back.on(
			'click',
			function () {
				this.$svgContainer.html( '' ).append( this.originalContainerContent );
				this.$credit[ 0 ].href = this.infoUrls[ this.currentView ][ this.currentImage ];
				$backContainer.remove();
				setTimeout(
					function () {
						this.$countrySelect.css( 'display', 'inline-block' );
						this.loadRegionChartSwitch();
						this.initSVGControls();
					}.bind( this ),
					100
				);
			}.bind( this )
		);
		$( '.OWIDSliderSVGContainer' ).before( $backContainer );
	}
};

// Include jquery.mousewheel dependency.
// --------
/* ! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.11
 *
 * Requires: jQuery 1.2.2+
 */

( function ( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ 'jquery' ], factory );
	} else if ( typeof exports === 'object' ) {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory( jQuery );
	}
}( function ( $ ) {
	var toFix = [ 'wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll' ],
		toBind =
      'onwheel' in document || document.documentMode >= 9 ?
							[ 'wheel' ] :
							[ 'mousewheel', 'DomMouseScroll', 'MozMousePixelScroll' ],
		slice = Array.prototype.slice,
		nullLowestDeltaTimeout,
		lowestDelta;

	if ( $.event.fixHooks ) {
		for ( let i = toFix.length; i; ) {
			$.event.fixHooks[ toFix[ --i ] ] = $.event.mouseHooks;
		}
	}

	var special = ( $.event.special.mousewheel = {
		version: '3.1.11',

		setup: function () {
			if ( this.addEventListener ) {
				for ( let i = toBind.length; i; ) {
					this.addEventListener( toBind[ --i ], handler, false );
				}
			} else {
				this.onmousewheel = handler;
			}
			// Store the line height and page height for this particular element
			$.data( this, 'mousewheel-line-height', special.getLineHeight( this ) );
			$.data( this, 'mousewheel-page-height', special.getPageHeight( this ) );
		},

		teardown: function () {
			if ( this.removeEventListener ) {
				for ( let i = toBind.length; i; ) {
					this.removeEventListener( toBind[ --i ], handler, false );
				}
			} else {
				this.onmousewheel = null;
			}
			// Clean up the data we added to the element
			$.removeData( this, 'mousewheel-line-height' );
			$.removeData( this, 'mousewheel-page-height' );
		},

		getLineHeight: function ( elem ) {
			var $parent =
        $( elem )[ 'offsetParent' in $.fn ? 'offsetParent' : 'parent' ]();
			if ( !$parent.length ) {
				$parent = $( 'body' );
			}
			return parseInt( $parent.css( 'fontSize' ), 10 );
		},

		getPageHeight: function ( elem ) {
			return $( elem ).height();
		},

		settings: {
			adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
			normalizeOffset: true // calls getBoundingClientRect for each event
		}
	} );

	$.fn.extend( {
		mousewheel: function ( fn ) {
			return fn ? this.on( 'mousewheel', fn ) : this.trigger( 'mousewheel' );
		},

		unmousewheel: function ( fn ) {
			return this.off( 'mousewheel', fn );
		}
	} );

	function handler( event ) {
		var orgEvent = event || window.event,
			args = slice.call( arguments, 1 ),
			delta = 0,
			deltaX = 0,
			deltaY = 0,
			absDelta = 0,
			offsetX = 0,
			offsetY = 0;
		event = $.event.fix( orgEvent );
		event.type = 'mousewheel';

		// Old school scrollwheel delta
		if ( 'detail' in orgEvent ) {
			deltaY = orgEvent.detail * -1;
		}
		if ( 'wheelDelta' in orgEvent ) {
			deltaY = orgEvent.wheelDelta;
		}
		if ( 'wheelDeltaY' in orgEvent ) {
			deltaY = orgEvent.wheelDeltaY;
		}
		if ( 'wheelDeltaX' in orgEvent ) {
			deltaX = orgEvent.wheelDeltaX * -1;
		}

		// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
		if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			deltaX = deltaY * -1;
			deltaY = 0;
		}

		// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
		delta = deltaY === 0 ? deltaX : deltaY;

		// New school wheel delta (wheel event)
		if ( 'deltaY' in orgEvent ) {
			deltaY = orgEvent.deltaY * -1;
			delta = deltaY;
		}
		if ( 'deltaX' in orgEvent ) {
			deltaX = orgEvent.deltaX;
			if ( deltaY === 0 ) {
				delta = deltaX * -1;
			}
		}

		// No change actually happened, no reason to go any further
		if ( deltaY === 0 && deltaX === 0 ) {
			return;
		}

		// Need to convert lines and pages to pixels if we aren't already in pixels
		// There are three delta modes:
		//   * deltaMode 0 is by pixels, nothing to do
		//   * deltaMode 1 is by lines
		//   * deltaMode 2 is by pages
		if ( orgEvent.deltaMode === 1 ) {
			var lineHeight = $.data( this, 'mousewheel-line-height' );
			delta *= lineHeight;
			deltaY *= lineHeight;
			deltaX *= lineHeight;
		} else if ( orgEvent.deltaMode === 2 ) {
			var pageHeight = $.data( this, 'mousewheel-page-height' );
			delta *= pageHeight;
			deltaY *= pageHeight;
			deltaX *= pageHeight;
		}

		// Store lowest absolute delta to normalize the delta values
		absDelta = Math.max( Math.abs( deltaY ), Math.abs( deltaX ) );

		if ( !lowestDelta || absDelta < lowestDelta ) {
			lowestDelta = absDelta;

			// Adjust older deltas if necessary
			if ( shouldAdjustOldDeltas( orgEvent, absDelta ) ) {
				lowestDelta /= 40;
			}
		}

		// Adjust older deltas if necessary
		if ( shouldAdjustOldDeltas( orgEvent, absDelta ) ) {
			// Divide all the things by 40!
			delta /= 40;
			deltaX /= 40;
			deltaY /= 40;
		}

		// Get a whole, normalized value for the deltas
		delta = Math[ delta >= 1 ? 'floor' : 'ceil' ]( delta / lowestDelta );
		deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ]( deltaX / lowestDelta );
		deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ]( deltaY / lowestDelta );

		// Normalise offsetX and offsetY properties
		if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
			var boundingRect = this.getBoundingClientRect();
			offsetX = event.clientX - boundingRect.left;
			offsetY = event.clientY - boundingRect.top;
		}

		// Add information to the event object
		event.deltaX = deltaX;
		event.deltaY = deltaY;
		event.deltaFactor = lowestDelta;
		event.offsetX = offsetX;
		event.offsetY = offsetY;
		// Go ahead and set deltaMode to 0 since we converted to pixels
		// Although this is a little odd since we overwrite the deltaX/Y
		// properties with normalized deltas.
		event.deltaMode = 0;

		// Add event and delta to the front of the arguments
		args.unshift( event, delta, deltaX, deltaY );

		// Clearout lowestDelta after sometime to better
		// handle multiple device types that give different
		// a different lowestDelta
		// Ex: trackpad = 3 and mouse wheel = 120
		if ( nullLowestDeltaTimeout ) {
			clearTimeout( nullLowestDeltaTimeout );
		}
		nullLowestDeltaTimeout = setTimeout( nullLowestDelta, 200 );

		return ( $.event.dispatch || $.event.handle ).apply( this, args );
	}

	function nullLowestDelta() {
		lowestDelta = null;
	}

	function shouldAdjustOldDeltas( orgEvent, absDelta ) {
		// If this is an older event and the delta is divisable by 120,
		// then we are assuming that the browser is treating this as an
		// older mouse wheel event and that we should divide the deltas
		// by 40 to try and get a more usable deltaFactor.
		// Side note, this actually impacts the reported scroll distance
		// in older browsers and can cause scrolling to be slower than native.
		// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
		return (
			special.settings.adjustOldDeltas &&
      orgEvent.type === 'mousewheel' &&
      absDelta % 120 === 0
		);
	}
} ) );

// --- Start image stack popup
$( OWIDSlider.init ); // Script written by Bawolff for WikiProject Med Foundation based on earlier OWIDSlider script by Hellerhoff.