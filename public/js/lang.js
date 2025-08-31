export let translations = {};

export async function loadLang() {
    const lang = localStorage.getItem("language") || "en";
    const res = await fetch(`./lang/${lang}.json`);
    translations = await res.json();
    updateTexts();
}

export function updateTexts() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const text = getNestedTranslation(key);
        if (Array.isArray(text)) el.innerText = text.join("\n");
        else if (typeof text === "string") el.innerText = text;
    });
}

export function setLanguage(lang) {
    localStorage.setItem("language", lang);
    loadLang();
}

function getNestedTranslation(key) {
    return key.split(".").reduce((obj, i) => obj?.[i], translations);
}
