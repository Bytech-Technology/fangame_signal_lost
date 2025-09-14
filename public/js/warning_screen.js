let cancelSequence = false;

function delay(ms) {
    return new Promise(resolve  => setTimeout(resolve, ms));
}

export function clearWarningTimeouts() {
    cancelSequence = true;
}

async function showCard(cards, index, showDurations, gapTime) {
    const card = cards[index];
    if (!card) return;

    card.classList.add("visible");
    
    const visibleTime = showDurations[index] || 5000;
    
    await delay(visibleTime);
    if (cancelSequence) return;
    
    card.classList.remove("visible");

    if (index + 1 < cards.length) {
        await delay(gapTime)
        if (cancelSequence) return;
        await showCard(cards, index + 1, showDurations, gapTime);
    }
 }

export async function startWarningSequence(callback) {
    const cards = document.querySelectorAll(".warning_card");
    if (!cards.length) return;

    cancelSequence = false;

    cards.forEach(card => card.classList.remove("visible"));
 
    const showDurations = [5000, 8000]; // primera 5s, segunda 8s
    const gapTime = 1000; // tiempo entre una y otra
    const initialDelay = 2000;

    await delay(initialDelay);
    if (cancelSequence) return;

    await showCard(cards, 0, showDurations, gapTime);
    if (cancelSequence) return;

    if (callback) callback();
}
