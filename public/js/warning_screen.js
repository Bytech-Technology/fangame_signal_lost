let warningTimeouts = [];

export function clearWarningTimeouts() {
    warningTimeouts.forEach(id => clearTimeout(id));
    warningTimeouts = [];
}

function showCard(cards, index) {
    const card = cards[index];
    if (!card) return;


    card.classList.add("visible");

    const showDurations = [5000, 8000]; // primera 5s, segunda 8s
    const gapTime = 1000;
    const visibleTime = showDurations[index] || 5000;

    // guardar el timeout para poder limpiarlo después
    warningTimeouts.push(setTimeout(() => {
        card.classList.remove("visible");

        warningTimeouts.push(setTimeout(() => {
            if (index + 1 < cards.length) {
                showCard(cards, index + 1);
            }
        }, gapTime));

    }, visibleTime));
}

export function startWarningSequence(callback) {
    const cards = document.querySelectorAll(".warning_card");
    if (!cards.length) return;

    // 🔥 limpiar todo antes de empezar
    clearWarningTimeouts();
    cards.forEach(card => card.classList.remove("visible"));
 
    const showDurations = [5000, 8000]; // primera 5s, segunda 8s
    const gapTime = 1000; // tiempo entre una y otra
    const initialDelay = 2000;

    warningTimeouts.push(setTimeout(() => {
        showCard(cards, 0);

        // calcular tiempo total dinámico
        const totalTime = showDurations.reduce((a, b) => a + b, 0) + gapTime * (cards.length - 1) + initialDelay;

        warningTimeouts.push(setTimeout(() => {
            if (callback) callback();
        }, totalTime));

    }, initialDelay));
}
