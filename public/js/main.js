import { startWarningSequence, clearWarningTimeouts } from "./warning_screen.js";
import Office from "./ofice.js";
import { GAME_STATES } from "./config.js"
import HUD from "./HUD.js";
import { initSettings } from "./settings.js";
import { Animatronics, startAnimatronics, stopAnimatronics } from "./animatronics.js";
import { initCredits } from "./credits.js";
import { initGameOver } from "./game_over.js";

export class game {
    constructor(config = {}) {
        // configuracion base del juego
        this.config = {
            language: "en",
            ...config
        }

        this.GAME_STATES = GAME_STATES;
        // Estado global
        this.state = GAME_STATES.MENU;


        // secciones html
        this.sectionMenu = document.getElementById('menu_game')
        this.sectionWarning = document.getElementById('warning_screen')
        this.sectionOffice = document.getElementById('ofice')
        this.sectionConfig = document.getElementById('settings')
        this.sectionCredits = document.getElementById('credits')
        this.sectionGameOver = document.getElementById('game_over');

        // botones
        this.btnPlay = document.getElementById('playBtn')
        this.btnSettings = document.getElementById('settingsBtn')
        this.btnCredits = document.getElementById('CreditsBtn')
        this.btnExit = document.getElementById('exitBtn')

        // estado de juego
        this.isRunning = false

        // inicializar eventos de menu
        this._initMenu()

        initSettings(this);
        initCredits(this);
        initGameOver(this);
    
        this.hud = null;
        this.Office = null;
    }

    _initMenu() {
        this.btnPlay.addEventListener('click', () => this.start());
        this.btnSettings.addEventListener('click', () => this.showSettings());
        this.btnCredits.addEventListener('click', () => this.showCredits());
        this.btnExit.addEventListener('click', () => this.exitGame());
    }

    setState(newState) {
        this.state = newState;
        console.log("Nuevo estado:", this.state);

        // Ocultamos todas las secciones
        this.sectionMenu.style.display = 'none';
        this.sectionWarning.style.display = 'none';
        this.sectionOffice.style.display = 'none';
        this.sectionConfig.style.display = 'none';
        this.sectionCredits.style.display = 'none';
        this.sectionGameOver.style.display = 'none'

        switch (newState) {
            case this.GAME_STATES.MENU:
                this.sectionMenu.style.display = 'flex';
                break;

            case this.GAME_STATES.WARNING:
                this.sectionWarning.style.display = 'flex';
                break;

            case this.GAME_STATES.OFFICE:
                this.sectionOffice.style.display = 'block';
                break;

            case this.GAME_STATES.SETTINGS:
                this.sectionConfig.style.display = "flex"
                break;

            case this.GAME_STATES.CREDITS:
                this.sectionCredits.style.display = "flex"
                break;

            case this.GAME_STATES.NEXT_DAY:
                // TODO: manejar transición al siguiente día
                break;
            
            case this.GAME_STATES.GAME_OVER:
                this.sectionGameOver.style.display = "flex"
                break;
        }
    }

    reset(){
        stopAnimatronics(this);

        // limpiar warning screen
        clearWarningTimeouts();
        
        // Reinicar HUD
        if(this.hud) {
            clearInterval(this.hud.batteryInterval);
            clearInterval(this.hud.clockInterval);
            
            if (this.hud.gameOverTimeout) {
                clearTimeout(this.hud.gameOverTimeout);
            }
        }
        this.hud = null;

        // Reiniciar Oficina
        this.Office = null;

        // Resetear Flags
        this.isRunning = false;
        this.animatronicsActive = false;

        // Resetear posiciones de los animatronicos
        Object.values(Animatronics).forEach(anim => anim.regresarSpawn());        
    }
    start() {

        // siempre resetear antes de iniciar
        this.reset();

        // Iniciar juego
        this.isRunning = true

        this.setState(GAME_STATES.WARNING);

        // Llamar a la secuencia de advertencias
        startWarningSequence(() => {
            this._onWarningComplete();
        })

    }

    _onWarningComplete() {
        this.setState(GAME_STATES.OFFICE);

        this.hud = new HUD(this);
        this.Office = new Office(this.hud);

        startAnimatronics(this, this.hud);
    }

    showSettings(){
        console.log("mostrando configuracion");
        this.setState(GAME_STATES.SETTINGS)
    }

    showCredits() {
        console.log("mostrando creditos");
        this.setState(GAME_STATES.CREDITS);
        // TODO: implementar pantala de creditos 
    }

    exitGame() {
        console.log("saliendo del juego");
        this.setState(GAME_STATES.GAME_OVER);
        // TODO: implementar salida del juego

    }
}

// Inicializar la instancia cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const myGame = new game();
});
