import { translations } from "./lang.js";

export function initGameOver(gameInstance) {
    const retryBtn = document.getElementById("retryBtn");
    const menuBtn = document.getElementById("menuBtn");
    const killerInfo = document.getElementById("killerInfo");
    const gameOverContainer = document.getElementById("game_over");

    gameInstance.showGameOver = function(animatronicName) {
        // mensaje dinámico
        const msg = translations.game_over?.messages?.[animatronicName] || `${animatronicName} te atrapó!`;
        killerInfo.innerHTML = msg.replace(/\n/g, "<br>");

        // fondo dinámico
        // gameOverContainer.style.backgroundImage = `url("images/game_over_${animatronicName}.png")`;
        // ejemplo practico
        gameOverContainer.style.backgroundImage = `url("images/game_over_Foxy.png")`;
    };

    retryBtn.addEventListener("click", () => {
        gameInstance.start(); 
    });
    menuBtn.addEventListener("click", () => {
        gameInstance.reset();
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });
}
