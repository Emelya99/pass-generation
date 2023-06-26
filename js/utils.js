import { popupCopied } from './storage.js';

// Функція, яка отримує пароль, зберігає в буфер обміну і відображає попап з нарписом "Copied" на 1 секунду
export const visibleCopiedPopup = (text) => {
    // Додаємо в буфер обміну пароль
    navigator.clipboard.writeText(text);
    // Додаємо клас до поапу, а через секунду прибираємо його, таким чином він відображаеться
    popupCopied.classList.add('active');
    setTimeout(function() {
        popupCopied.classList.remove('active');
    }, 1000);
}

// Функція яка генерує історію пароля
export const renderHistoryPass = (pass) => {
    // Отримаємо пароль і за допомогою шаблонних рядків вставляємо його в HTML
    let htmlContent =
        `<li class="history-item">
            <p class="history-pass">${pass}</p>
            <img class="history-copy" src="img/copy.svg" alt="copy">
        </li>`

    // Повертаємо розмітку
    return htmlContent;
}

// Функція яка підраховуємо кількість певних єлементів в паролі
export const characterCount = (length, arr, pass) => {
    let count = 0;
    for (let i = 0; i < length; i++) {
        if (arr.find(item => item === pass[i])) {
            count++;
        }
    }
    return count;
}