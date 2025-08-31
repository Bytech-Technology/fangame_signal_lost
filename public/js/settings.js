import { setLanguage, loadLang } from "./lang.js";

export function initSettings(gameInstance) {

    // Botones de idioma
    document.getElementById("lang-en-btn").addEventListener("click", () => {
        gameInstance.config.language = "en";
        setLanguage("en");
    });

    document.getElementById("lang-es-btn").addEventListener("click", () => {
        gameInstance.config.language = "es";
        setLanguage("es");
    });

    // Botón volver al menú
    document.getElementById("back-menu-btn").addEventListener("click", () => {
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });

    // Inicializar idioma al abrir Settings
    loadLang();
}
