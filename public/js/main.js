// -----------------------------------------------------------
// main.js
// Entry point and central game controller.
// Manages all major game states (Menu, Warning, Office, Settings, Credits, Game Over),
// initializes main systems (HUD, SoundManager, Animatronics),
// and coordinates transitions between scenes.
// -----------------------------------------------------------

import { startWarningSequence, clearWarningTimeouts } from "./warning_screen.js";
import Office from "./ofice.js";
import { GAME_STATES } from "./config.js"
import HUD from "./HUD.js";
import { initSettings } from "./settings.js";
import { Animatronics, startAnimatronics, stopAnimatronics } from "./animatronics.js";
import { initCredits } from "./credits.js";
import { initGameOver } from "./game_over.js";
import { SoundManager } from "./sound_manager.js"


/**
 * Main game class — controls global state and scene transitions.
 */
export class game {
    constructor(config = {}) {
        // Base game configuration (default language: English)
        this.config = {
            language: "en",
            ...config
        }

        this.GAME_STATES = GAME_STATES;
        this.state = GAME_STATES.MENU; // current global state


        // HTML sections
        this.sectionMenu = document.getElementById('menu_game')
        this.sectionWarning = document.getElementById('warning_screen')
        this.sectionOffice = document.getElementById('ofice')
        this.sectionConfig = document.getElementById('settings')
        this.sectionCredits = document.getElementById('credits')
        this.sectionGameOver = document.getElementById('game_over');

        // Menu buttons
        this.btnPlay = document.getElementById('playBtn')
        this.btnSettings = document.getElementById('settingsBtn')
        this.btnCredits = document.getElementById('CreditsBtn')
        this.btnExit = document.getElementById('exitBtn')

        // Game runtime state
        this.isRunning = false

        // Initialize menu events
        this._initMenu()

        // Initialize core modules
        initSettings(this);
        initCredits(this);
        initGameOver(this);

        // Initialize and play menu ambience
        SoundManager.init();
        SoundManager.play("ambience", "menu");

        this.hud = null;
        this.Office = null;
    }

    /**
     * Binds menu buttons to their corresponding actions.
     * Called once during initialization.
     */
    _initMenu() {
        this.btnPlay.addEventListener('click', () => this.start());
        this.btnSettings.addEventListener('click', () => this.showSettings());
        this.btnCredits.addEventListener('click', () => this.showCredits());
        this.btnExit.addEventListener('click', () => this.exitGame());
    }

    /**
     * Updates the current game state and manages screen transitions.
     * @param {string} newState - The new state to set (from GAME_STATES)
     */
    setState(newState) {
        this.state = newState;
        console.log("Nuevo estado:", this.state);

        // Hide all sections before showing the active one
        this.sectionMenu.style.display = 'none';
        this.sectionWarning.style.display = 'none';
        this.sectionOffice.style.display = 'none';
        this.sectionConfig.style.display = 'none';
        this.sectionCredits.style.display = 'none';
        this.sectionGameOver.style.display = 'none';

        // Handle each state visually and via SoundManager
        switch (newState) {
            case this.GAME_STATES.MENU:
                this.sectionMenu.style.display = 'flex';
                SoundManager.play("ambience", "menu");
                break;

            case this.GAME_STATES.WARNING:
                this.sectionWarning.style.display = 'flex';
                SoundManager.stop("ambience", "menu");
                break;

            case this.GAME_STATES.OFFICE:
                this.sectionOffice.style.display = 'block';
                SoundManager.play("ambience", "office");
                SoundManager.play("ambience", "night");
                break;

            case this.GAME_STATES.SETTINGS:
                this.sectionConfig.style.display = "flex"
                break;

            case this.GAME_STATES.CREDITS:
                this.sectionCredits.style.display = "flex"
                break;

            case this.GAME_STATES.NEXT_DAY:
                // TODO: Handle transition to next night
                break;

            case this.GAME_STATES.GAME_OVER:
                this.sectionGameOver.style.display = "flex"
                SoundManager.stop("ambience", "office");
                SoundManager.stop("ambience", "night");

                break;
        }
    }

    /**
     * Resets all systems and clears active elements before a new session.
     */
    reset() {
        stopAnimatronics(this);

        // Clear warning timeouts
        clearWarningTimeouts();

        // Reset HUD and clear intervals/timeouts
        if (this.hud) {
            clearInterval(this.hud.batteryInterval);
            clearInterval(this.hud.clockInterval);

            if (this.hud.gameOverTimeout) {
                clearTimeout(this.hud.gameOverTimeout);
            }
        }
        this.hud = null;

        // Reset office and animatronics
        this.Office = null;
        this.isRunning = false;
        this.animatronicsActive = false;

        // Return all animatronics to their spawn points
        Object.values(Animatronics).forEach(anim => anim.regresarSpawn());
    }

    /**
     * Starts a new game session.
     * Resets everything and launches the warning sequence.
     */
    start() {
        this.reset();
        this.isRunning = true
        this.setState(GAME_STATES.WARNING);

        // Start the warning screen sequence, then continue to the game
        startWarningSequence(() => {
            this._onWarningComplete();
        })

    }

    /**
     * Called when the warning sequence finishes.
     * Initializes the office, HUD, and animatronic logic.
     */
    _onWarningComplete() {
        this.setState(GAME_STATES.OFFICE);

        this.hud = new HUD(this);
        this.Office = new Office(this.hud);

        // If intro ambience exists, play it before activating AI
        if (SoundManager.channels.ambience["intro"]) {
            SoundManager.introPlaying = true;
            SoundManager.play("ambience", "intro");

            SoundManager.once("ambience", "intro", null, () => {
                SoundManager.introPlaying = false;

                // Restore ambience volume and start animatronics
                SoundManager.setVolume("ambience", SoundManager.volumes.ambience);
                startAnimatronics(this, this.hud);
            })
        } else {
            startAnimatronics(this, this.hud);
        }
    }

    /**
     * Displays the settings menu.
     */
    showSettings() {
        this.setState(GAME_STATES.SETTINGS)
    }

    /**
     * Displays the credits screen.
     */
    showCredits() {
        console.log("mostrando creditos");
        this.setState(GAME_STATES.CREDITS);
    }

    /**
     * Exits the game if running inside Electron.
     */
    exitGame() {
        if (window.electronAPI) {
            window.electronAPI.exitGame();
        }
    }
}

// -----------------------------------------------------------
// Game bootstrap — create instance when DOM is ready.
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const myGame = new game();
});
