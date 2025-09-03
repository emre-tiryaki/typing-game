// query selector dinamik çağırma(gpt)
export function qs(selector) {
    return document.querySelector(selector);
}
// query selectorall dinamik çağırma(gpt)

export function qsa(selector) {
    return document.querySelectorAll(selector);
}

export function onReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}
