
// const currencyRBCListURL = 'https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=USD&currency_to=EUR&source=cbrf&sum=5000&date=';
// const currencyRBCListURL = 'https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=USD&currency_to=EUR&source=cbrf&sum=5000&date=';

// const currencyRBCListURL = 'https://cash.rbc.ru/cash/json/converter_currency_rate/';


let currFrom = "USD";
let currTo = "RUR";
let source = "cbrf";
let currSumm = "1";

const TestURL = `https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=${currFrom}&currency_to=${currTo}&source=${source}&sum=${currSumm}&date=`;

// const currencyRBCListURL = 'https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=${name}&currency_to=EUR&source=cbrf&sum=5000&date=';
//https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=USD&currency_to=RUR&source=cbrf&sum=1&date=
//https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=USD&currency_to=RUR&source=cbrf&sum=1&date=
// https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=RUR&currency_to=DKK&source=cbrf&sum=1&date=2022-07-04
// `https://cash.rbc.ru/cash/json/converter_currency_rate/?currency_from=${currFrom}&currency_to=${currTo}&source=${source}&sum=${currSumm}&date=`
// const currencyRatesURL = 'https://www.cbr-xml-daily.ru/latest.js';

var currencyRatesJSON = {};
var currRateReq = new XMLHttpRequest();
currRateReq.open('GET', TestURL, false);
currRateReq.send();
if (currRateReq.status != 200) {
    alert(currRateReq.status + ': ' + currRateReq.statusText);
} else {
    currencyRatesJSON = currRateReq.responseText;
}

console.log(currencyRatesJSON);