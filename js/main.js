import { storage } from './storage.js';
import { visibleCopiedPopup } from './utils.js';

const passwordContainer = document.querySelector('.password');
const createPass = passwordContainer.querySelector('.create-pass');
const copyBtn = passwordContainer.querySelector('.copy-btn');
const mainInput = passwordContainer.querySelector('.main-input');
const passwordRightPart = document.querySelector('.right-part');
/* Input Range */
const inputRange = passwordContainer.querySelector('#range-input');
const inputRangeValue = passwordContainer.querySelector('.range-value');
const inputRangeMaxValue = inputRange.max;
/* Checkboxes */
const uppercaseCheckBox = passwordContainer.querySelector('#uppercase');
const differentCheckBox = passwordContainer.querySelector('#different');
const numbersCheckBox = passwordContainer.querySelector('#numbers');
const symbolsCheckBox = passwordContainer.querySelector('#symbols');
/* History Elements */
const historyList = passwordContainer.querySelector('.history-list');

const clearHistoryBtn = passwordContainer.querySelector('.clear-history_btn');

const { alfabet, numbers, symbols } = storage;

const alfabetArr = alfabet.split('');
const numbersArr = numbers.split('');
const symbolsArr = symbols.split('');

const generationPass = () => {
    let passLength = inputRangeValue.value || 10;
    let finalPass = '';
    let finalArr = [];
    finalArr.push(...alfabetArr);

    if (numbersCheckBox.checked) {
        finalArr.push(...numbersArr);
    }
    if (symbolsCheckBox.checked) {
        finalArr.push(...symbolsArr);
    }
    finalArr.sort(() => Math.round(Math.random() * 100) - 50);

    for (let i = 0; i < passLength; i++) {
        let randomArrIndex = Math.floor(Math.random() * finalArr.length);
        
        if(uppercaseCheckBox.checked && alfabetArr.find(item => item === finalArr[randomArrIndex])) {
            let randomNum = Math.floor(Math.random() * 10);
            if(randomNum > 7) {
                finalPass += finalArr[randomArrIndex].toUpperCase();
            } else {
                finalPass += finalArr[randomArrIndex];
            }
        } else {
            finalPass += finalArr[randomArrIndex];
        }

        if(differentCheckBox.checked) {
            finalArr.splice(randomArrIndex, 1);
        }
    }

    // Render pass in block historyList
    let layoutHistoryPass =
        `<li class="history-item">
            <p class="history-pass">${finalPass}</p>
            <img class="history-copy" src="img/copy.svg" alt="copy">
        </li>`
    historyList.insertAdjacentHTML('beforeend', layoutHistoryPass);

    mainInput.value = finalPass;
    passwordRightPart.style.display = 'block';
}
generationPass();

const copyPassword = () => {
    let passText = mainInput.value;
    visibleCopiedPopup(passText);
}

const updateRangeValue = () => {
    let val = inputRange.value
    inputRangeValue.value = val;
    inputRangeValue.style.left = Number(val) * (100 / inputRangeMaxValue) + '%';
}
updateRangeValue();

const clearHistory = () => {
    historyList.replaceChildren();
    passwordRightPart.style.display = 'none';
}

const copyHistoryPasses = (e) => {
    let buttonText = e.target.previousSibling.previousSibling.innerHTML;
    visibleCopiedPopup(buttonText);
}

passwordContainer.addEventListener('click', function(event) {
    if (event.target.matches('.history-copy')) {
        copyHistoryPasses(event);
    }
});
inputRange.addEventListener('input', updateRangeValue);
copyBtn.addEventListener('click', copyPassword);
clearHistoryBtn.addEventListener('click', clearHistory);
createPass.addEventListener('click', generationPass);