import { countryData } from './data.js';

const currencyRatesURL = 'https://www.cbr-xml-daily.ru/latest.js';

var currencyRatesJSON = {};
var currRateReq = new XMLHttpRequest();
currRateReq.open('GET', currencyRatesURL, false);
currRateReq.send();
if (currRateReq.status != 200) {
    alert(currRateReq.status + ': ' + currRateReq.statusText);
} else {
    currencyRatesJSON = currRateReq.responseText;
}

const currencyListURL = 'https://www.cbr-xml-daily.ru/daily_json.js';

var currencyListJSON = {};
var currListReq = new XMLHttpRequest();
currListReq.open('GET', currencyListURL, false);
currListReq.send();
if (currListReq.status != 200) {
    alert(currListReq.status + ': ' + currListReq.statusText);
} else {
    currencyListJSON = currListReq.responseText;
}
let currData = JSON.parse(currencyListJSON);
let currDataList = currData.Valute;
let currValutes = [];

for (let data in currDataList) {
    let value = currDataList[data];
    let ItemData = {};
    ItemData = value;
    currValutes.push(data);
}

const secondApi = document.querySelector('.rbk-api');

const currListArr = secondApi.querySelectorAll('.currencies__list');
const sectionFrom = secondApi.querySelector('.converter__currency--from');
const sectionTo = secondApi.querySelector('.converter__currency--to');
const overlay = document.querySelector('.overlay');
const currencySelectButton = secondApi.querySelector('.currency-switch__button--show-all');
const currencySelectButtonArr = secondApi.querySelectorAll('.currency-switch__button--show-all');
const currencySelectList = secondApi.querySelector('.currencies__list');
const currencySelectListArr = secondApi.querySelectorAll('.currencies__list');
let parentCurrencyItems = secondApi.querySelectorAll('.currencies__item');

// запуск калькулятора
const inputArr = secondApi.querySelectorAll('.currency__input');
const inputFrom = secondApi.querySelector('.currency__input--from');
const inputFromDesc = secondApi.querySelector('.currency__description--from');
const inputFromValueDesc = secondApi.querySelector('.currency__exchange-value--from');
const inputTo = secondApi.querySelector('.currency__input--to');
const inputToDesc = secondApi.querySelector('.currency__description--to');
const inputToValueDesc = secondApi.querySelector('.currency__exchange-value--to');
const buttonCurrSwap = secondApi.querySelector('.converter__button-swap');
const buttonCurrSwapArr = secondApi.querySelectorAll('.converter__button-swap');

let currenciesSwitchItems = secondApi.querySelectorAll('.currency-switch');


let generateCyrrList = (valute) => {
    currListArr.forEach(list => {
        let currItem = document.createElement('li');
        currItem.className = "currencies__item";
        currItem.classList.add('currency-item');
        currItem.setAttribute('currency-id', String(`${currDataList[valute]["CharCode"]}`))
        list.append(currItem);

        let currItemName = document.createElement('p');
        currItemName.className = "currency-item__name";
        currItemName.textContent = String(`${currDataList[valute]["Name"]}`);
        currItem.append(currItemName);

        let currItemCharcode = document.createElement('p');
        currItemCharcode.className = "currency-item__char";
        currItemCharcode.textContent = String(`${currDataList[valute]["CharCode"]}`);
        currItem.append(currItemCharcode);
    });
};

currValutes.forEach(valute => {
    generateCyrrList(valute)
});

let calculateExchange = () => {
    var exRate;
    var exRateFrom;
    var exRateTo;
    var nominalRate;
    let inputFromId = inputFrom.getAttribute('curr-id');
    let inputToId = inputTo.getAttribute('curr-id');

    const getExRate = () => {
        if (inputToId == 'RUR') {
            if (inputFromId == 'RUR' && inputToId == 'RUR') {
                exRate = 1;
                nominalRate = 1;
            } else if (inputToId != 'RUR') {
                exRateTo = currData.Valute[inputFromId].Value;
                exRate = 1 / exRateTo;
                nominalRate = 1;
            } else {
                exRateTo = currData.Valute[inputFromId].Value;
                nominalRate = 1;
                exRate = exRateTo;
            }
        } else if (inputFromId != 'RUR') {
            exRate = 1 / currData.Valute[inputToId].Value;
            nominalRate = currData.Valute[inputToId].Nominal;
            nominalRate = 1;
        } else {
            exRate = 1 / currData.Valute[inputToId].Value;
            nominalRate = currData.Valute[inputToId].Nominal;
        }
        if (inputFromId != 'RUR' && inputToId != 'RUR') {
            exRateFrom = currData.Valute[inputFromId].Value;
            exRateTo = currData.Valute[inputToId].Value;
            exRate = exRateFrom / exRateTo;
        }
        if (inputFromId == inputToId) {
            exRate = 1;
            nominalRate = 1;
        }
    }

    getExRate();

    inputFrom.value = Number(nominalRate);
    inputTo.value = Number(inputFrom.value * exRate).toFixed(3);
    inputFromDesc.textContent = inputFromId;
    inputToDesc.textContent = inputToId;
    inputFromValueDesc.textContent = String(`1 ${inputFromId} = ${exRate.toFixed(3)} ${inputToId}`);
    inputToValueDesc.textContent = String(`1 ${inputToId} = ${(1 / exRate).toFixed(3)} ${inputFromId}`);

    inputFrom.addEventListener('input', function () {
        inputFrom.value = (inputFrom.value.replace(',', '.').replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, "."));
        inputTo.value = Number(inputFrom.value * exRate).toFixed(3);
    })

    inputTo.addEventListener('input', function () {
        inputTo.value = (inputTo.value.replace(',', '.').replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, "."));
        inputFrom.value = Number(inputTo.value * exRate).toFixed(3);
    })
}

calculateExchange();

let setCurrency = (item) => {
    let parent = item.closest('.converter__currency');
    let parentList = parent.querySelector('.currencies__list');
    let parentInput = parent.querySelector('.currency__input');
    let parentItemsArr = parent.querySelectorAll('.currency-switch');
    let itemId = item.getAttribute('currency-id');
    let switchCurrencyItem = parent.querySelector('.currency-switch--new-selected');
    let switchCurrencyDesc = switchCurrencyItem.querySelector('.currency-switch__char');

    if (itemId == "RUR" || itemId == "USD" || itemId == "EUR") {
    } else {
        switchCurrencyItem.setAttribute('currency-id', itemId)
        switchCurrencyDesc.textContent = itemId;
        parentInput.setAttribute('curr-id', itemId)
        parentItemsArr.forEach(item => {
            item.classList.remove('active');
        });
        calculateExchange();
        switchCurrencyItem.classList.add('active');
    }
    overlay.classList.remove('active');
    parentList.classList.add('hidden');
};

let switchCurrency = (item) => {
    let parent = item.closest('.converter__currency');
    let parentList = parent.closest('.currencies__switch-list');
    let parentSwitchItems = parent.querySelectorAll('.currency-switch');
    let parentInput = parent.querySelector('.currency__input');
    parentSwitchItems.forEach(switchItem => {
        switchItem.classList.remove('active');
    });
    let itemId = item.getAttribute('currency-id');
    parentInput.setAttribute('curr-id', itemId)
    calculateExchange();
    item.classList.add('active');
};

currenciesSwitchItems.forEach(item => {
    item.addEventListener('click', function () {
        switchCurrency(item);
    })
});

currencySelectButtonArr.forEach(button => {
    let parent = button.closest('.converter__currency');
    button.addEventListener('click', function (evt) {
        evt.preventDefault();
        button.classList.add('active');
        let parentCurrencyList = parent.querySelector('.currencies__list');
        let parentCurrencyItems = parent.querySelectorAll('.currencies__item');
        parentCurrencyList.classList.remove('hidden');
        overlay.classList.add('active');
        parentCurrencyItems.forEach(item => {
            item.onclick = () => {
                button.classList.remove('active');
                setCurrency(item);
            };
        });
    })
});


overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
    currencySelectButtonArr.forEach(button => {
        button.classList.remove('active');
    });
    currencySelectListArr.forEach(list => {
        list.classList.add('hidden');
    });
    parentCurrencyItems.forEach(link => {
        link.onclick = '';
    });
});

const swapSwitchCurr = () => {
    let switchItemsFromArr = sectionFrom.querySelectorAll('.currency-switch');
    let switchItemsToArr = sectionTo.querySelectorAll('.currency-switch');
    let switchCurrCharArrFrom = sectionFrom.querySelectorAll('.currency-switch__char');
    let switchCurrCharArrTo = sectionTo.querySelectorAll('.currency-switch__char');
    let switchFromIndex;
    let switchToIndex;

    for (let i = 0; i < switchItemsFromArr.length; i++) {
        if (switchItemsFromArr[i].classList.contains('active')) {
            switchFromIndex = i;
        }
    }
    for (let b = 0; b < switchItemsToArr.length; b++) {
        if (switchItemsToArr[b].classList.contains('active')) {
            switchToIndex = b;
        }
    }
    if (switchFromIndex == 3 || switchToIndex == 3) {
        let swapIdFrom = switchItemsFromArr[3].getAttribute('currency-id');
        let swapIdTo = switchItemsToArr[3].getAttribute('currency-id');
        switchItemsToArr[3].setAttribute('currency-id', swapIdFrom);
        switchItemsFromArr[3].setAttribute('currency-id', swapIdTo);
        switchCurrCharArrFrom[3].textContent = swapIdTo;
        switchCurrCharArrTo[3].textContent = swapIdFrom;
    }
    switchItemsFromArr[switchToIndex].click();
    switchItemsToArr[switchFromIndex].click();
};

buttonCurrSwapArr.forEach(swap => {
    swap.addEventListener('click', function () {
        let swapBufferFrom = inputFrom.getAttribute('curr-id');
        let swapBufferTo = inputTo.getAttribute('curr-id');
        inputFrom.setAttribute('curr-id', swapBufferTo);
        inputTo.setAttribute('curr-id', swapBufferFrom);
        swapSwitchCurr();
        calculateExchange();
    });
});


// установка базовой валюты

let browserMainLang = navigator.languages[0].match(/[^\s-]+-?/g);
let mainLang = browserMainLang[1];
let startCurr = countryData.Country[mainLang].Valute;

// startCurr = 'DKK';


// console.log(startCurr);

const setBasicCurrency = () => {
    let currenciesSwitchItems = sectionFrom.querySelectorAll('.currency-switch');
    currenciesSwitchItems.forEach(item => {
        if (item.getAttribute('currency-id') == startCurr) {
            item.click();
        }
    });

    if (startCurr != "RUR" || startCurr != "EUR" || startCurr != "USD") {
        let fromCurrencyItems = sectionFrom.querySelectorAll('.currencies__item');
        fromCurrencyItems.forEach(item => {
            // console.log(item.getAttribute('currency-id'));
            if (item.getAttribute('currency-id') == startCurr) {
                fromCurrencyItems.forEach(item => {
                    item.onclick = () => {
                        // button.classList.remove('active');
                        setCurrency(item);
                    };
                });
                item.click();
                fromCurrencyItems.forEach(item => {
                    item.onclick = "";
                });
            }
        });
    }
}

setBasicCurrency();

