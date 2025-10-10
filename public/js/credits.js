// -----------------------------------------------------------
// credits.js
// Handles the Credits screen interactions.
// Keeps logic modular and separate from main.js.
// -----------------------------------------------------------

/**
 * Initializes the credits screen.
 * @param {Object} gameInstance - Reference to the main game instance.
 */
export function initCredits(gameInstance) {
    document.getElementById("closeCredits").addEventListener("click", () => {
        // Return to menu when closing credits
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });
}
