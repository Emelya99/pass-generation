import { storage } from './storage.js';
import { visibleCopiedPopup, renderHistoryPass, characterCount } from './utils.js';

const passwordContainer = document.querySelector('.password');
const createPass = passwordContainer.querySelector('.create-pass');
const copyBtn = passwordContainer.querySelector('.copy-btn');
const mainInput = passwordContainer.querySelector('.main-input');
const strenghtPass = passwordContainer.querySelector('.strength-pass');
const passwordRightPart = document.querySelector('.right-part');
/* Input Range */
const inputRange = passwordContainer.querySelector('#range-input');
const inputRangeValue = passwordContainer.querySelector('.range-value');
const inputRangeMaxValue = inputRange.max;
/* Checkboxes */
const checkBoxesContainer = passwordContainer.querySelector('.extra-settings');
const uppercaseCheckBox = passwordContainer.querySelector('#uppercase');
const differentCheckBox = passwordContainer.querySelector('#different');
const numbersCheckBox = passwordContainer.querySelector('#numbers');
const symbolsCheckBox = passwordContainer.querySelector('#symbols');
/* History Elements */
const historyList = passwordContainer.querySelector('.history-list');
const clearHistoryBtn = passwordContainer.querySelector('.clear-history_btn');
/* LocalStorage Elements */
let localStorageLastPass = JSON.parse(localStorage.getItem('lastPass')) || false;
let localStoragePassArr = JSON.parse(localStorage.getItem('AllPassArr')) || [];
let localStorageRangePosition = JSON.parse(localStorage.getItem('rangePosition')) || false;
let localStorageCheckboxObj = JSON.parse(localStorage.getItem('checkboxesState')) || {};

const { alfabet, numbers, symbols } = storage;

// Перевід строки до масиву
const alfabetArr = alfabet.split('');
const numbersArr = numbers.split('');
const symbolsArr = symbols.split('');

// Функція для відображення надійності пароля, приймає число яке відповідає за надійність пароля
const strenghtPassFunc = (num) => {
    // Видаляємо попередню надійність пароля
    strenghtPass.replaceChildren();
    for (let i = 0; i < 4; i++) {
        // Створюємо span
        let span = document.createElement('span');
        // Якщо число яке отрумує функція білеше за 0
        if (num > 0) {
            // До створенного span додаємо класс 'active'
            span.classList.add('active');
            // Віднімаємо 1 від числа яке прийшло в функцію
            num--;
        }
        // Додаємо в верстку надійність пароля
        strenghtPass.appendChild(span);
    }
}

// Функція яка перевіряє надійність пароля і виставляє надійність
const passwordComplexityCheck = (password) => {
    // Довжина нового пароля
    let passwordLength = password.length;
    // За допомогою функції дізнаєтося скільки цифр
    let numberCount = characterCount(passwordLength, numbersArr, password);
    // За допомогою функції дізнаєтося скільки символів
    let symbolCount = characterCount(passwordLength, symbolsArr, password);
    // За допомогою функції дізнаєтося скільки маленьких букв
    let letterCount = characterCount(passwordLength, alfabetArr, password);
    // За допомогою розрахунків отрумаємо скільки великих літур в паролі
    let letterUppercaseCount = passwordLength - numberCount - symbolCount - letterCount;
    // Значення надійності пароля
    let strength = 0;

    // 5 перевірок для отримання надійності пароля
    // Їх саме 5, а не 4 тому, що до прикладу великий пароль(25 символів) може отримати надійність 1 якщо в нього не буду цифр та символів
    if (passwordLength > 7) {
        strength++;
    }
    if (numberCount >= 1) {
        strength++;
    }
    if (symbolCount >= 1) {
        strength++;
    }
    if (letterUppercaseCount >= 1) {
        strength++;
    }
    if (letterCount > 20) {
        strength++;
    }
    // Передаємо значення надійності в функцію strenghtPassFunc яка відобразить результат
    strenghtPassFunc(strength);
}

// Основна функція цього проєкту, генерування пароля
const generationPass = () => {
    // Отримаємо яка довжина пароля потрібна бути
    let passLength = inputRange.value;
    // Змінна для нового пароля
    let finalPass = '';
    // Масив в який ми будемо додавати усі необхідні єлементи, які за допомогою рандому сгенерують пароль
    let finalArr = [];
    // Одназу до масиву додаємо алфавіт
    finalArr.push(...alfabetArr);

    // Якщо чекбокс з цифррами активный, то додаэмо до основного масиву
    if (numbersCheckBox.checked) {
        finalArr.push(...numbersArr);
    }
    // На данному этапі ми маємо масив який включає в себе алфавіт та цифри в порядку зростання
    // За допомогою метода sort ми перемішуємо масив
    finalArr.sort(() => Math.round(Math.random() * 100) - 50);

    // Цикл за домогою якого відбувається основна магія
    for (let i = 0; i < passLength; i++) {
        // Отрамаємо рандомній індекс з нашого масиву
        let randomArrIndex = Math.floor(Math.random() * finalArr.length);

        // На 4 єтерації якщо чекбокс з символами активний, то ми додаємо масив символів до основного масиву
        // Це зроблено для того, щоб майбутній пароль не починався з символів
        if (i === 4 && symbolsCheckBox.checked) {
            finalArr.push(...symbolsArr);
        }
        
        // Якщо чекбокс с великими літерами активний і це буква
        if(uppercaseCheckBox.checked && alfabetArr.find(item => item === finalArr[randomArrIndex])) {
            // Рандомна цифра від 0 до 10
            let randomNum = Math.floor(Math.random() * 10);
            // Якщо цифра більша за 7, то ми її робимо велику
            if(randomNum > 7) {
                // Та додаємо до змінної пароля
                finalPass += finalArr[randomArrIndex].toUpperCase();
            } else {
                // Додаємо букву до пароля
                finalPass += finalArr[randomArrIndex];
            }
        } else {
            // Додаємо букву до пароля
            finalPass += finalArr[randomArrIndex];
        }

        // Якщо активний чекбокс з "Do not repeat" ми за допомогою індекса видаляємо єлемент з масиву
        if(differentCheckBox.checked) {
            finalArr.splice(randomArrIndex, 1);
        }
    }

    // Генеруємо та додаємо на сторінку історію пароля
    let layoutHistoryPass = renderHistoryPass(finalPass);
    historyList.insertAdjacentHTML('beforeend', layoutHistoryPass);

    // Додаємо в головный інпут отриманий пароль
    mainInput.value = finalPass;
    // Відображаємо історію паролей
    passwordRightPart.style.display = 'block';
    // Додаємо пароль до масиву в якому зберігаються всі паролі
    localStoragePassArr.push(finalPass);
    // Відправляємо пароль до функції, яка проаналізує пароль і присвоїть йому рівень надійності
    passwordComplexityCheck(finalPass);
    
    // Додаємо до localStorage отриманний пароль і масив всіх паролей
    localStorage.setItem('AllPassArr', JSON.stringify(localStoragePassArr));
    localStorage.setItem('lastPass', JSON.stringify(finalPass));
}

// Якщо ми маємо позицію ренжу в localStorage
// Позицію дається при першому рендему сторінки і образу зберігається в localStorage
if (localStorageRangePosition) {
    // Достаємо з localStorage позицію повзунка, яка відповідає за довжину пароля
    inputRange.value = localStorageRangePosition;
    // Якщо в localStorage є данні про чекбокси
    if (localStorageCheckboxObj) {
        // Проходимося по об'єкту і присвоюємо checked відповідно до значення
        Object.entries(localStorageCheckboxObj).map(([key, value]) => {
            let elemId = document.getElementById(key);
            let elemChecked = value;
            if(elemChecked) {
                elemId.checked = true;
            }
        });
    }
    // Якщо ми маємо в localStorage масив з останніми паролями
    if (localStoragePassArr) {
        // Проходимся по масиву і за допомогою функції генеруємо і відображаємо HTML на страрінці
        localStoragePassArr.map(item => {
            let layoutHistoryPass = renderHistoryPass(item);
            historyList.insertAdjacentHTML('beforeend', layoutHistoryPass);
        })
    }
    // Відображаємо останній пароль в головномі інпуті та визиваємо функцію надійності пароля
    if(localStorageLastPass) {
        mainInput.value = localStorageLastPass;
        passwordComplexityCheck(localStorageLastPass);
    } else {
        generationPass();
    }
} else {
    // Якщо це перший вхід на сторінку, то вказуємо дефолтну довжину пароля і запускаємо функцію генерування пароля
    inputRange.value = 10;
    generationPass();
}

// Функція копіювання основного пароля
const copyPassword = () => {
    // Отримуємо пароль
    let passText = mainInput.value;
    // Вивід попапа на декілька секунд
    visibleCopiedPopup(passText);
}

// Функція для копіювання пароля зі списку останніх паролей
const copyHistoryPasses = (e) => {
    // Отримаємо пароль
    let buttonText = e.target.previousSibling.previousSibling.innerHTML;
    // Вивід попапа на декілька секунд
    visibleCopiedPopup(buttonText);
}

// Функція для оновлення ползунка
const updateRangeValue = () => {
    // Отримаємо значення яке зараз
    let val = inputRange.value;
    // Встановлюємо його саме до ползунка, який над квадратом
    inputRangeValue.value = val;
    // Вираховуємо позицію ползунка згідно з данними
    inputRangeValue.style.left = Number(val) * (100 / inputRangeMaxValue) + '%';

    // Додоємо до localStorage
    localStorage.setItem('rangePosition', JSON.stringify(val));
}
updateRangeValue();

// Функція яка обнуляє історію паролей
const clearHistory = () => {
    historyList.replaceChildren();
    passwordRightPart.style.display = 'none';

    localStoragePassArr = [];
    localStorage.removeItem('AllPassArr');
    localStorage.removeItem('lastPass');
}

// Для отмимання значення чекбокса і додовання до localStorage
checkBoxesContainer.addEventListener('click', function(event) {
    if (event.target.matches('input')) {
        let elem = event.srcElement;
        let elemId = elem.id;
        let elemChecked = elem.checked;
        localStorageCheckboxObj[elemId.toString()] = elemChecked;
        localStorage.setItem('checkboxesState', JSON.stringify(localStorageCheckboxObj));
    }
})
// Слухач для копіювання пароля з останніх паролей
passwordContainer.addEventListener('click', function(event) {
    if (event.target.matches('.history-copy')) {
        copyHistoryPasses(event);
    }
});
// Слухач для оновлення позиції ползунка
inputRange.addEventListener('input', updateRangeValue);
// Слухач для копіювання нового пароля
copyBtn.addEventListener('click', copyPassword);
// Слухач для видалення історіх паролей
clearHistoryBtn.addEventListener('click', clearHistory);
// Слухач для генерації нового пароля
createPass.addEventListener('click', generationPass);