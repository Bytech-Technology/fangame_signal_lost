import { startWarningSequence } from "./warning_screen.js";
import Office from "./ofice.js";

export class game {
    constructor(config = {}) {
        // configuracion base del juego
        this.config = {}

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

    start() {
        // Iniciar juego
        console.log("iniciando juego con config:", this.config)
        this.isRunning = true

        // Ocultar menu y mostrar advertencias
        this.sectionMenu.style.display = 'none'
        this.sectionWarning.style.display = 'flex'

        // Llamar a la secuencia de advertencias
        startWarningSequence(() => {
            this._onWarningComplete();
        })

    }

    _onWarningComplete() {
        // Ocultar advertencias y mostar oficina
        this.sectionWarning.style.display = 'none'
        this.sectionOffice.style.display = 'block'

        console.log("juego iniciado: oficina cargada");

        // instancia de la oficina
        this.Office = new Office();
    }

    showCredits() {
        console.log("mostrando creditos");
        // TODO: implementar pantala de creditos 
    }

    exitGame() {
        console.log("saliendo del juego");
        // TODO: implementar salida del juego

    }
}

// Inicializar la instancia cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const myGame = new game();
});
