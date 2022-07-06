import '../js/exchange-1.js';
import '../js/exchange-2.js';
import '../js/test.js';

import { countryData } from './data.js';

let browserMainLang = navigator.languages[0].match(/[^\s-]+-?/g);
let mainLang = browserMainLang[1];
let startCurr = countryData.Country[mainLang]

// console.log(startCurr);