import { countryData } from './data.js';

const currencyListURL = 'https://www.cbr-xml-daily.ru/daily_json.js';

var currencyListJSON = {};
let result = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then((response) => {
        return response.text();
    })
    .then((data) => {
        return data;
    });

currencyListJSON = result;

let currData = JSON.parse(currencyListJSON);
let currDataList = currData.Valute;
let currValutes = [];

for (let data in currDataList) {
    let value = currDataList[data];
    let ItemData = {};
    ItemData = value;
    currValutes.push(data);
}

const firstApi = document.querySelector('.cbrf-api');
const currListArr = firstApi.querySelectorAll('.currencies__list');
const sectionFrom = firstApi.querySelector('.converter__currency--from');
const sectionTo = firstApi.querySelector('.converter__currency--to');
const overlay = document.querySelector('.overlay');
const currencySelectButtonArr = firstApi.querySelectorAll('.switch-action__button--show-all');
const currencySelectListArr = firstApi.querySelectorAll('.currencies__list');
let parentCurrencyItems = firstApi.querySelectorAll('.currencies__item');

// запуск калькулятора
const inputFrom = firstApi.querySelector('.currency__input--from');
const inputFromDesc = firstApi.querySelector('.currency__description--from');
const inputFromValueDesc = firstApi.querySelector('.currency__exchange-value--from');
const inputTo = firstApi.querySelector('.currency__input--to');
const inputToDesc = firstApi.querySelector('.currency__description--to');
const inputToValueDesc = firstApi.querySelector('.currency__exchange-value--to');
const buttonCurrSwapArr = firstApi.querySelectorAll('.converter__button-swap');
let currenciesSwitchItems = firstApi.querySelectorAll('.currency-switch');

// установка времени обновления курса
const currUpdateTime = firstApi.querySelector('.converter__update-time');
currUpdateTime.textContent = `Дата обновления курсов ${currData.Date}`;

let generateCurrList = (valute) => {
    currListArr.forEach(list => {
        let currItem = document.createElement('li');
        currItem.className = "currencies__item";
        currItem.classList.add('currency-item');
        currItem.setAttribute('data-currency', String(`${currDataList[valute]["CharCode"]}`))
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
    generateCurrList(valute)
});

inputFrom.value = 1;

let calculateExchange = () => {
    var exRate;
    var exRateFrom;
    var exRateTo;
    var nominalRate;
    let inputFromId = inputFrom.getAttribute('data-curr-input');
    let inputToId = inputTo.getAttribute('data-curr-input');

    const getExRate = () => {
        if (inputToId == 'RUR') {
            if (inputFromId == 'RUR' && inputToId == 'RUR') {
                exRate = 1;
            } else if (inputToId != 'RUR') {
                exRateTo = currData.Valute[inputFromId].Value;
                exRate = 1 / exRateTo;
            } else {
                exRateTo = currData.Valute[inputFromId].Value;
                exRate = exRateTo;
            }
        } else if (inputFromId != 'RUR') {
            exRate = 1 / currData.Valute[inputToId].Value;
            nominalRate = 1;
        } else {
            exRate = 1 / currData.Valute[inputToId].Value;
        }
        if (inputFromId != 'RUR' && inputToId != 'RUR') {
            exRateFrom = currData.Valute[inputFromId].Value;
            exRateTo = currData.Valute[inputToId].Value;
            exRate = exRateFrom / exRateTo;
        }
        if (inputFromId == inputToId) {
            exRate = 1;
        }
    }

    getExRate();

    if (inputFrom.value.length == 0) {
        inputFrom.value = 1;
    }
    inputFrom.value = inputFrom.value.replace(/\s/g, '');
    inputTo.value = Number(inputFrom.value * exRate).toFixed(3);
    inputFrom.value = String(inputFrom.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
    inputTo.value = String(inputTo.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

    inputFromDesc.textContent = inputFromId;
    inputToDesc.textContent = inputToId;
    inputFromValueDesc.textContent = String(`1 ${inputFromId} = ${exRate.toFixed(3)} ${inputToId}`);
    inputToValueDesc.textContent = String(`1 ${inputToId} = ${(1 / exRate).toFixed(3)} ${inputFromId}`);

    inputFrom.addEventListener('input', function () {
        inputFrom.value = (inputFrom.value.replace(',', '.').replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, "."));
        inputTo.value = Number(inputFrom.value * exRate).toFixed(3);
        inputFrom.value = String(inputFrom.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
        inputTo.value = String(inputTo.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
        let checkDecimal = inputTo.value.split('.')[1].split('');
        for (let i = checkDecimal.length - 1; i >= 0; i--) {
            if (checkDecimal[i] == '0') {
                checkDecimal.splice(-1, 1)
            }
        }
        if (inputFrom.value.length == 0 || inputTo.value.length == 0) {
            inputFrom.value = '';
            inputTo.value = '';
        }
    })

    inputTo.addEventListener('input', function () {
        inputTo.value = (inputTo.value.replace(',', '.').replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, "."));
        inputFrom.value = Number(inputTo.value * exRate).toFixed(3);
        inputFrom.value = String(inputFrom.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
        inputTo.value = String(inputTo.value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

        if (inputFrom.value.length == 0 || inputTo.value.length == 0) {
            inputFrom.value = '';
            inputTo.value = '';
        }
    })
}

calculateExchange();

let setCurrency = (item) => {
    let parent = item.closest('.converter__currency');
    let parentList = parent.querySelector('.currencies__list');
    let parentInput = parent.querySelector('.currency__input');
    let parentItemsArr = parent.querySelectorAll('.currency-switch');
    let itemId = item.getAttribute('data-currency');
    let switchCurrencyItem = parent.querySelector('.currency-switch--new-selected');
    let switchCurrencyDesc = switchCurrencyItem.querySelector('.currency-switch__char');

    if (itemId == "RUR" || itemId == "USD" || itemId == "EUR") {
    } else {
        switchCurrencyItem.setAttribute('data-currency', itemId)
        switchCurrencyDesc.textContent = itemId;
        parentInput.setAttribute('data-curr-input', itemId)
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
    let parentSwitchItems = parent.querySelectorAll('.currency-switch');
    let parentInput = parent.querySelector('.currency__input');
    parentSwitchItems.forEach(switchItem => {
        switchItem.classList.remove('active');
    });
    let itemId = item.getAttribute('data-currency');
    parentInput.setAttribute('data-curr-input', itemId)
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
        let swapIdFrom = switchItemsFromArr[3].getAttribute('data-currency');
        let swapIdTo = switchItemsToArr[3].getAttribute('data-currency');
        switchItemsToArr[3].setAttribute('data-currency', swapIdFrom);
        switchItemsFromArr[3].setAttribute('data-currency', swapIdTo);
        switchCurrCharArrFrom[3].textContent = swapIdTo;
        switchCurrCharArrTo[3].textContent = swapIdFrom;
    }
    switchItemsFromArr[switchToIndex].click();
    switchItemsToArr[switchFromIndex].click();
};

buttonCurrSwapArr.forEach(swap => {
    swap.addEventListener('click', function () {
        let swapBufferFrom = inputFrom.getAttribute('data-curr-input');
        let swapBufferTo = inputTo.getAttribute('data-curr-input');
        inputFrom.setAttribute('data-curr-input', swapBufferTo);
        inputTo.setAttribute('data-curr-input', swapBufferFrom);
        swapSwitchCurr();
        calculateExchange();
    });
});

// установка базовой валюты от языка браузера
let regionTitle = firstApi.querySelector('.converter__region-title');
if (navigator.languages) {
    let browserMainLang = navigator.languages[0].match(/[^\s-]+-?/g);
    let mainLang;
    if (browserMainLang.length > 1) {
        mainLang = browserMainLang[1];
    } else {
        mainLang = String(browserMainLang).toUpperCase();
    }

    let startCurr = countryData.Country[mainLang].Valute;
    regionTitle.textContent = `Регион по браузеру: ${mainLang}`;
    const setBasicCurrency = () => {
        let currenciesSwitchItems = sectionFrom.querySelectorAll('.currency-switch');
        currenciesSwitchItems.forEach(item => {
            if (item.getAttribute('data-currency') == startCurr) {
                item.click();
            }
        });
        if (startCurr != "RUR" || startCurr != "EUR" || startCurr != "USD") {
            let fromCurrencyItems = sectionFrom.querySelectorAll('.currencies__item');
            fromCurrencyItems.forEach(item => {
                if (item.getAttribute('data-currency') == startCurr) {
                    fromCurrencyItems.forEach(item => {
                        item.onclick = () => {
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

} else {
    regionTitle.textContent = 'Регион не определен';

    const setBasicCurrency = () => {
        let currenciesSwitchItems = sectionFrom.querySelectorAll('.currency-switch');
        currenciesSwitchItems[0].click();
    }
    setBasicCurrency();
}
