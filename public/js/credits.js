export function initCredits(gameInstance) {
    document.getElementById("closeCredits").addEventListener("click", () => {
        gameInstance.setState(gameInstance.GAME_STATES.MENU);
    });
}