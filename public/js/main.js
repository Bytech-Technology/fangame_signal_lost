import { startWarningSequence } from "./warning_screen.js";

document.addEventListener('DOMContentLoaded', () => {

    const btnPlayGame = document.getElementById('playBtn')
    const btnCredits = document.getElementById('creditsBtn')
    const btnExit = document.getElementById('exitBtn')

    // section menu_game
    const sectionMenugame = document.getElementById('menu_game')
    // section adventencias
    const sectionPrecaution = document.getElementById('warning_screen')
    // section ofice
    const sectionOfice = document.getElementById('ofice')

    btnPlayGame.addEventListener('click', () => {
        sectionPrecaution.style.display = 'flex'
        sectionMenugame.style.display = 'none'

        startWarningSequence(() => {
            sectionPrecaution.style.display = 'none';
            // iniciar seccion de juego 
            sectionOfice.style.display = 'block';
    })
    })
});