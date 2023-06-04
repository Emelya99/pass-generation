import { storage } from './storage.js';

const passForm = document.querySelector('.password-form');
const createPass = passForm.querySelector('.create-pass');
const copyBtn = passForm.querySelector('.copy-btn');
const mainInput = passForm.querySelector('.main-input');
/* Input Range */
const inputRange = passForm.querySelector('#range-input');
const inputRangeValue = passForm.querySelector('.range-value');
const inputRangeMaxValue = inputRange.max;
/* Checkboxes */
const uppercaseCheckBox = passForm.querySelector('#uppercase');
const differentCheckBox = passForm.querySelector('#different');
const numbersCheckBox = passForm.querySelector('#numbers');
const symbolsCheckBox = passForm.querySelector('#symbols');
/* Popups */
const popupCopied = document.querySelector('.popup-copied');

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

    mainInput.value = finalPass;
}
generationPass();

const copyPassword = () => {
    let passText = mainInput.value;
    navigator.clipboard.writeText(passText);
    popupCopied.classList.add('active');
    setTimeout(function() {
        popupCopied.classList.remove('active');
    }, 1000);
}

const updateRangeValue = () => {
    let val = inputRange.value
    inputRangeValue.value = val;
    inputRangeValue.style.left = Number(val) * (100 / inputRangeMaxValue) + '%';
}
updateRangeValue();

inputRange.addEventListener('input', updateRangeValue);
copyBtn.addEventListener('click', copyPassword);
createPass.addEventListener('click', generationPass);