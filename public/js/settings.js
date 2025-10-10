// -----------------------------------------------------------
// settings.js
// Manages the Settings menu: language selection and sound controls.
// Handles language buttons, volume sliders (ambience and SFX), and
// navigation back to the main menu.
// -----------------------------------------------------------

import { setLanguage, loadLang } from "./lang.js";
import { SoundManager} from "./sound_manager.js"

/**
 * Initializes the Settings screen and binds UI events.
 * @param {object} gameInstance - Reference to the main game instance.
 */
export function initSettings(gameInstance) {

    // ----------------
    // Language buttons
    // ----------------
    
    document.getElementById("lang-en-btn").addEventListener("click", () => {
        gameInstance.config.language = "en";
        setLanguage("en");
    });

    document.getElementById("lang-es-btn").addEventListener("click", () => {
        gameInstance.config.language = "es";
        setLanguage("es");
    });

    // ----------------
    // Sound controls (ambience + sfx)
    // ----------------
    
    const ambienceVolume = document.getElementById("ambience-volume");
    const sfxVolume = document.getElementById("sfx-volume");

    // Load saved volume values
    ambienceVolume.value = SoundManager.volumes.ambience;
    sfxVolume.value = SoundManager.volumes.sfx;

    // Apply volume levels at init
    SoundManager.setVolume("ambience", parseFloat(ambienceVolume.value));
    SoundManager.setVolume("sfx", parseFloat(sfxVolume.value));

    // Live volume adjustments
    ambienceVolume.addEventListener("input", e =>{
        const value = parseFloat(e.target.value);
        SoundManager.setVolume("ambience", value);
    })
    
    sfxVolume.addEventListener("input", e =>{
        const value = parseFloat(e.target.value);
        SoundManager.setVolume("sfx", value);
    })

    // ----------------
    // Return to main menu
    // ----------------

    document.getElementById("back-menu-btn").addEventListener("click", () => {
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });

    // Initialize current language when opening settings
    loadLang();
}
