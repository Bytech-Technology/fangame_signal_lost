const cards = document.querySelectorAll(".warning_card");

// duracion visible de cada card 
const showDurations = [5000, 8000]; // primera 5s, segunda 8s
const gapTime = 1000; // tiempo entre una y otra

function showCard(index) {
    const card = cards[index];
    if (!card) return;

    // Mostrar con animación
    card.classList.add("visible");

    // tiempo visible según el array
    const visibleTime = showDurations[index] || 5000; // fallback si hay más cards

    setTimeout(() => {
        card.classList.remove("visible");

        // esperar gap antes de la siguiente
        setTimeout(() => {
            if (index + 1 < cards.length) {
                showCard(index + 1);
            }
        }, gapTime);

    }, visibleTime);
}

export function startWarningSequence(callback) {
    if (!cards.length) return;

    // delay inicial antes de la primera card
    const initialDelay = 2000;
    setTimeout(() => {
        showCard(0);

        // calcular tiempo total dinámico
        const totalTime = showDurations.reduce((a, b) => a + b, 0) + gapTime * (cards.length - 1) + initialDelay;

        setTimeout(() => {
            if (callback) callback();
        }, totalTime);
        
    }, initialDelay);
}
