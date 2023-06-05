import { popupCopied } from './storage.js';

export const visibleCopiedPopup = (text) => {
    navigator.clipboard.writeText(text);
    popupCopied.classList.add('active');
    setTimeout(function() {
        popupCopied.classList.remove('active');
    }, 1000);
}