import { popupCopied } from './storage.js';

export const visibleCopiedPopup = (text) => {
    navigator.clipboard.writeText(text);
    popupCopied.classList.add('active');
    setTimeout(function() {
        popupCopied.classList.remove('active');
    }, 1000);
}

export const renderHistoryPass = (pass) => {
    let htmlContent =
        `<li class="history-item">
            <p class="history-pass">${pass}</p>
            <img class="history-copy" src="img/copy.svg" alt="copy">
        </li>`

    return htmlContent;
}

export const characterCount = (length, arr, pass) => {
    let count = 0;
    for (let i = 0; i < length; i++) {
        if (arr.find(item => item === pass[i])) {
            count++;
        }
    }
    return count;
}