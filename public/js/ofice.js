document.getElementById("left_door").addEventListener("click", () => {
    console.log("Left door clicked");
});

document.getElementById("right_door").addEventListener("click", () => {
    console.log("right door clicked");
});

document.getElementById("computer_camera").addEventListener("click", () => {
    console.log("camera compute clicked");
});


const wrapper = document.getElementById("ofice__panorama");
let currentX = -100; // posición inicial en vw (centro = -100vw)
let interval = null;
const speed = 5; // velocidad (vw por frame)

function updatePosition() {
  wrapper.style.transform = `translateX(${currentX}vw)`;
}

// Función para empezar a moverse en una dirección
function startMoving(direction) {
  stopMoving(); // aseguro que no haya dos intervals
  interval = setInterval(() => {
    // mover según la dirección
    currentX += direction * speed;

    // limitar a rango [0, -200]
    if (currentX > 0) currentX = 0;
    if (currentX < -200) currentX = -200;

    updatePosition();
  }, 16); // ~60fps
}

// Frenar el movimiento
function stopMoving() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

// Hover zonas
document.getElementById("hover-left").addEventListener("mouseenter", () => {
  startMoving(1); // hacia derecha
});
document.getElementById("hover-right").addEventListener("mouseenter", () => {
  startMoving(-1); // hacia izquierda
});
document.getElementById("hover-left").addEventListener("mouseleave", stopMoving);
document.getElementById("hover-right").addEventListener("mouseleave", stopMoving);

// Inicializar
updatePosition();