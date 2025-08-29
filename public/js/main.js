import { startWarningSequence } from "./warning_screen.js";
import Office from "./ofice.js";
import { GAME_STATES } from "./config.js"
import HUD from "./HUD.js";


export class game {
    constructor(config = {}) {
        // configuracion base del juego
        this.config = {}
        this.GAME_STATES = GAME_STATES;
        // Estado global
        this.state = GAME_STATES.MENU;


        // secciones html
        this.sectionMenu = document.getElementById('menu_game')
        this.sectionWarning = document.getElementById('warning_screen')
        this.sectionOffice = document.getElementById('ofice')

        // botones
        this.btnPlay = document.getElementById('playBtn')
        this.btnCredits = document.getElementById('CreditsBtn')
        this.btnExit = document.getElementById('exitBtn')

        // estado de juego
        this.isRunning = false

        // inicializar eventos de menu
        this._initMenu()
    }
    _initMenu() {
        this.btnPlay.addEventListener('click', () => this.start());
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

            case this.GAME_STATES.CREDITS:
                // TODO: mostrar créditos
                break;

            case this.GAME_STATES.NEXT_DAY:
                // TODO: manejar transición al siguiente día
                break;
            
            case this.GAME_STATES.GAME_OVER:
                // TODO: mostrar pantalla de game over
                break;
        }
    }

    start() {
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
