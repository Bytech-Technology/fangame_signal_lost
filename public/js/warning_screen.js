// -----------------------------------------------------------
// warning_screen.js
// Controls the warning screen sequence shown before gameplay.
// Manages timed card transitions, delays, and sequence cancellation.
// -----------------------------------------------------------

let cancelSequence = false;

/**
 * Utility helper for async time delays.
 * @param {number} ms - Time in milliseconds to wait.
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve  => setTimeout(resolve, ms));
}

/**
 * Stops the current warning card sequence immediately.
 * Called when switching game state before the sequence finishes.
 */

export function clearWarningTimeouts() {
    cancelSequence = true;
}

/**
 * Displays a single warning card, then recursively calls itself
 * to show the next one after a delay.
 * @param {NodeList} cards - List of card DOM elements.
 * @param {number} index - Current card index.
 * @param {number[]} showDurations - Array of visible durations for each card.
 * @param {number} gapTime - Time between cards in ms.
 */

async function showCard(cards, index, showDurations, gapTime) {
    const card = cards[index];
    if (!card) return;

    card.classList.add("visible");
    
    const visibleTime = showDurations[index] || 5000;    
    await delay(visibleTime);
    if (cancelSequence) return;

    card.classList.remove("visible");

    // Continue to the next card after a small gap
    if (index + 1 < cards.length) {
        await delay(gapTime)
        if (cancelSequence) return;
        await showCard(cards, index + 1, showDurations, gapTime);
    }
 }

/**
 * Starts the entire warning card animation sequence.
 * Each card fades in/out for a set duration, then calls the provided callback.
 * @param {Function} [callback] - Optional function to call when finished.
*/

export async function startWarningSequence(callback) {
    const cards = document.querySelectorAll(".warning_card");
    if (!cards.length) return;

    cancelSequence = false;
    cards.forEach(card => card.classList.remove("visible"));
 
    const showDurations = [5000, 8000]; // first card: 5s, second: 8s
    const gapTime = 1000;               // delay between cards
    const initialDelay = 2000;          // wait before showing the first card

    await delay(initialDelay);
    if (cancelSequence) return;

    await showCard(cards, 0, showDurations, gapTime);
    if (cancelSequence) return;

    if (callback) callback();
}
