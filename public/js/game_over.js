// -----------------------------------------------------------
// game_over.js
// Handles the Game Over screen interactions, including retry
// and return to menu functionality. Modular and separate from main.js.
// -----------------------------------------------------------

import { translations } from "./lang.js";

/**
 * Initializes the Game Over screen logic.
 * @param {Object} gameInstance - Reference to the main game instance.
 */

export function initGameOver(gameInstance) {
    const retryBtn = document.getElementById("retryBtn");
    const menuBtn = document.getElementById("menuBtn");
    const killerInfo = document.getElementById("killerInfo");
    const gameOverContainer = document.getElementById("game_over");

    /**
     * Displays the Game Over message with the animatronic name.
     * Updates text and background image dynamically.
     * @param {string} animatronicName
     */

    gameInstance.showGameOver = function(animatronicName) {
        // Dynamic message (translations available)
        const msg = translations.game_over?.messages?.[animatronicName] || `${animatronicName} te atrapó!`;
        killerInfo.innerHTML = msg.replace(/\n/g, "<br>");

        // Dynamic background (example, can be customized per animatronic)
        // gameOverContainer.style.backgroundImage = `url("images/game_over_${animatronicName}.png")`;
        gameOverContainer.style.backgroundImage = `url("images/game_over_Foxy.png")`;
    };

    // Restart the game when clicking Retry
    retryBtn.addEventListener("click", () => {
        gameInstance.start(); 
    });

    // Return to main menu
    menuBtn.addEventListener("click", () => {
        gameInstance.reset();
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });
}
