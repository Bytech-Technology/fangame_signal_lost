import { setLanguage, loadLang } from "./lang.js";
import { SoundManager} from "./sound_manager.js"

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

    // ----------------
    // Controles de sonido SOLO ambience + sfx
    // ----------------
    const ambienceVolume = document.getElementById("ambience-volume");
    const sfxVolume = document.getElementById("sfx-volume");

    ambienceVolume.value = SoundManager.volumes.ambience;
    sfxVolume.value = SoundManager.volumes.sfx;

    // aplicar al iniciar settings
    SoundManager.setVolume("ambience", parseFloat(ambienceVolume.value));
    SoundManager.setVolume("sfx", parseFloat(sfxVolume.value));

    // Listeners
    ambienceVolume.addEventListener("input", e =>{
        const value = parseFloat(e.target.value);
        SoundManager.setVolume("ambience", value);
    })
    
    sfxVolume.addEventListener("input", e =>{
        const value = parseFloat(e.target.value);
        SoundManager.setVolume("sfx", value);
    })

    // Botón volver al menú
    document.getElementById("back-menu-btn").addEventListener("click", () => {
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });

    // Inicializar idioma al abrir Settings
    loadLang();
}
