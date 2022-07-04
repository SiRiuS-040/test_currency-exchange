// import './menu-switchers.js';
// import './calendar.js';
// import './calendar-week.js';
// import './calendar-day.js';
// import './calendar-mini.js';
// import './data.js';
// import './popup-new-task.js';
// import './profile-hider.js';
// import './task-selector.js';
// // раздел все события
// import './all-tasks.js';
// // import './test-data.js';
// import './cookiemonster.js';

// // Header autohide
// var doc = document.documentElement;
// var w = window;
// var prevScroll = w.scrollY || doc.scrollTop;
// var curScroll;
// var direction = 0;
// var prevDirection = 0;
// var header = document.querySelector('.fake-header');

// var checkScroll = function () {
//     curScroll = w.scrollY || doc.scrollTop;
//     if (curScroll > prevScroll) {
//         //scrolled up
//         direction = 2;
//     } else if (curScroll < prevScroll) {
//         //scrolled down
//         direction = 1;
//     }

//     if (direction !== prevDirection) {
//         toggleHeader(direction, curScroll);
//     }

//     prevScroll = curScroll;
// };

// var toggleHeader = function (direction, curScroll) {
//     if (direction === 2 && curScroll > 55) {
//         //replace 52 with the height of your header in px
//         header.classList.add('hide');
//         $('.search__header').addClass('active')
//         prevDirection = direction;
//     } else if (direction === 1) {
//         header.classList.remove('hide');
//         $('.search__header').removeClass('active')
//         prevDirection = direction;
//     }
// };

// window.addEventListener('scroll', checkScroll);


const currDataURL = 'https://www.cbr-xml-daily.ru/daily_json.js';

var currDataJSON = {} //тут у нас будет результат
var xhr = new XMLHttpRequest();
xhr.open('GET', currDataURL, false);
xhr.send();
if (xhr.status != 200) {
    // обработать ошибку
    alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
} else {
    // вывести результат
    currDataJSON = xhr.responseText;
}


let currData = JSON.parse(currDataJSON)
console.log(currData);

let currList = currData.Valute;
console.log(currList);

let currName = currData.Valute.USD.Name;
// console.log(currName);

let currValue = currData.Valute.USD.Value;
// console.log(currValue);

const selectFrom = document.querySelector('.select-from');

const inputFrom = document.querySelector('.input-from');
const inputFromDesc = document.querySelector('.input-from-currency-desc');

const selectTo = document.querySelector('.select-from');

const inputTo = document.querySelector('.input-to');
const inputToDesc = document.querySelector('.input-to-currency-desc');

const selectCurrFrom = document.querySelectorAll('.input-radio-from');
const selectCurrTo = document.querySelectorAll('.input-radio-to');


let calculateExchange = () => {
    var exRate;
    var exRateFrom;
    var exRateTo;
    var nominalRate;

    const getExRate = () => {

        let inputFromId = inputFrom.getAttribute('curr-id');
        let inputToId = inputTo.getAttribute('curr-id');




        if (inputToId == 'RUR') {



            if (inputFromId == 'RUR' && inputToId == 'RUR') {
                exRate = 1;
            } else {
                exRateTo = currData.Valute[inputFromId].Value;
                exRate = 1 / exRateTo;
                nominalRate = 1;
            }

        } else {
            exRate = currData.Valute[inputToId].Value;
            nominalRate = currData.Valute[inputToId].Nominal;
        }



        // if (inputToId != 'RUR') {
        // exRate = currData.Valute[inputToId].Value;
        // nominalRate = currData.Valute[inputToId].Nominal;
        // }

        if (inputFromId != 'RUR') {
            exRateFrom = currData.Valute[inputFromId].Value;
            exRateTo = currData.Valute[inputToId].Value;
            // console.log('не рубль');
            exRate = exRateFrom / exRateTo;
        }

        if (inputFromId == inputToId) {
            exRate = 1;
            nominalRate = 1;
        }





    }

    getExRate();

    inputFrom.value = nominalRate;
    inputTo.value = inputFrom.value * exRate;

    console.log(nominalRate);
    console.log(exRate);

    inputFrom.addEventListener('input', function () {
        inputTo.value = inputFrom.value * exRate;
    })

    inputTo.addEventListener('input', function () {
        inputFrom.value = inputTo.value * exRate;
    })
}

calculateExchange();

selectCurrFrom.forEach(select => {
    let currId = select.getAttribute('curr-id');

    if (select.checked) {
        inputFrom.setAttribute('curr-id', currId);
        inputFromDesc.textContent = currId;
    }

    select.addEventListener('change', function () {

        if (select.checked) {
            inputFrom.setAttribute('curr-id', currId);
            inputFromDesc.textContent = currId;

            // exRate = currData.Valute[inputToId].Value;

            calculateExchange();
        }
    })

});

selectCurrTo.forEach(select => {
    let currId = select.getAttribute('curr-id');

    if (select.checked) {
        inputTo.setAttribute('curr-id', currId);
        inputToDesc.textContent = currId;
    }

    select.addEventListener('change', function () {



        if (select.checked) {
            inputTo.setAttribute('curr-id', currId);
            inputToDesc.textContent = currId;

            calculateExchange();
        }
    })


});

// console.log(rates);

