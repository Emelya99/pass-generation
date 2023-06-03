import { storage } from './storage.js';

const passForm = document.querySelector('.password-form');
const createPass = passForm.querySelector('.create-pass');
const copyBtn = passForm.querySelector('.copy-btn');
const mainInput = passForm.querySelector('.main-input');
const uppercaseCheckBox = passForm.querySelector('#uppercase');
const differentCheckBox = passForm.querySelector('#different');
const numbersCheckBox = passForm.querySelector('#numbers');
const symbolsCheckBox = passForm.querySelector('#symbols');
const popupCopied = document.querySelector('.popup-copied');

const { alfabet, numbers, symbols } = storage;

const alfabetArr = alfabet.split('');
const numbersArr = numbers.split('');
const symbolsArr = symbols.split('');
const passLength = 20;

const generationPass = () => {
    let finalPass = '';
    let finalArr = [];
    finalArr.push(...alfabetArr);

    if (numbersCheckBox.checked) {
        finalArr.push(...numbersArr);
    }
    if (symbolsCheckBox.checked) {
        finalArr.push(...symbolsArr);
    }
    // finalArr.sort(() => Math.round(Math.random() * 100) - 50);

    for (let i = 0; i < passLength; i++) {
        let finalArrIndex = Math.floor(Math.random() * finalArr.length);
        
        if(uppercaseCheckBox.checked && alfabetArr.find(item => item === finalArr[finalArrIndex])) {
            let randomNum = Math.floor(Math.random() * 10);
            if(randomNum > 7) {
                finalPass += finalArr[finalArrIndex].toUpperCase();
            } else {
                finalPass += finalArr[finalArrIndex];
            }
        } else {
            finalPass += finalArr[finalArrIndex];
        }

        if(differentCheckBox.checked) {
            finalArr.splice(finalArrIndex, 1);
        }
    }

    mainInput.value = finalPass;
}
generationPass();

const copyPassword = () => {
    let result = mainInput.value;
    navigator.clipboard.writeText(result);
    popupCopied.classList.add('active');
    setTimeout(function() {
        popupCopied.classList.remove('active');
    }, 1000);
}

copyBtn.addEventListener('click', copyPassword);
createPass.addEventListener('click', generationPass);