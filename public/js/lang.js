// -----------------------------------------------------------
// lang.js
// Handles language loading, translation updates, and persistence.
// Provides functions to load language JSON files and update UI elements dynamically.
// -----------------------------------------------------------

export let translations = {};

/**
 * Loads the current language from localStorage (default "en"),
 * fetches the corresponding JSON file, and updates the UI texts.
 */

export async function loadLang() {
    const lang = localStorage.getItem("language") || "en";
    const res = await fetch(`./lang/${lang}.json`);
    translations = await res.json();
    updateTexts();
}

/**
 * Updates all elements in the DOM that have the "data-i18n" attribute
 * with their corresponding translation.
 */

export function updateTexts() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const text = getNestedTranslation(key);
        if (Array.isArray(text)) el.innerText = text.join("\n");
        else if (typeof text === "string") el.innerText = text;
    });
}

/**
 * Sets a new language and reloads translations.
 * @param {string} lang - Language code, e.g., "en" or "es".
 */

export function setLanguage(lang) {
    localStorage.setItem("language", lang);
    loadLang();
}

/**
 * Helper function to get nested translation using dot notation.
 * @param {string} key - e.g., "game_over.messages.Freddy"
 * @returns {string | string[] | undefined}
 */

function getNestedTranslation(key) {
    return key.split(".").reduce((obj, i) => obj?.[i], translations);
}
