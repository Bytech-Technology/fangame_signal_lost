import { MAP_LOCATIONS } from "./config.js";
import { logMovement, exportLogs } from "./logger.js";

class Animatronic {
    constructor(nombre, spawn, iaLevel, intervaloMin, intervaloMax, rutas, pasosSonido, cancionMuerte) {
        this.nombre = nombre;
        this.spawn = spawn;
        this.posicion = spawn;
        this.iaLevel = iaLevel;
        this.intervaloMin = intervaloMin;
        this.intervaloMax = intervaloMax;
        this.rutas = rutas;
        this.pasosSonido = pasosSonido;
        this.cancionMuerte = cancionMuerte;
    }

    mover(horaActual, hud) {
        const posibles = this.rutas[this.posicion] || [];
        const oldPos = this.posicion;

        if (posibles.length === 0) return;
      
        if (this.nombre === "Freddy" && horaActual < 3) return; // Freddy se movera a las 3AM

        let nuevaPosicion;
        if (this.nombre === "Freddy") {
            nuevaPosicion = posibles[Math.floor(Math.random() * posibles.length)];
        } else {
            const opciones = [...posibles, this.posicion];
            nuevaPosicion = opciones[Math.floor(Math.random() * opciones.length)];
        }

        this.posicion = nuevaPosicion;

        // Guardar en log
        logMovement(this.nombre, oldPos, this.posicion, hud.time, MAP_LOCATIONS);
    }

    regresarSpawn() {
        this.posicion = this.spawn;
    }
}

export const Animatronics = {
    Freddy: new Animatronic("Freddy", 2, 8, 20, 40, {
        2: [1], 1: [3], 3: [4], 4: [8]
    }, "freddy_pasos.mp3", "freddy_song.mp3"),

    Foxy: new Animatronic("Foxy", 7, 12, 15, 30, {
        7: [6], 6: [4, 7], 4: [8, 6]
    }, "foxy_pasos.mp3", "foxy_song.mp3"),

    Chica: new Animatronic("Chica", 2, 10, 10, 25, {
        2: [1], 1: [6, 2], 6: [4, 1], 4: [8, 6]
    }, "chica_pasos.mp3", "chica_song.mp3"),

    Bonnie: new Animatronic("Bonnie", 2, 9, 10, 25, {
        2: [6], 6: [5, 2], 5: [7, 6], 7: [4, 5], 4: [8, 7]
    }, "bonnie_pasos.mp3", "bonnie_song.mp3"),
};

// ----------------
// Helpers
// ----------------
function parseHour(timeStr) {
    // convertir "12 AM" -> 0 , "01 AM" -> 1, etc
    const num = parseInt(timeStr.split(" ")[0], 10);
    return num === 12 ? 0 : num;
}

// ----------------
// Motor de movimiento
// ----------------
export function startAnimatronics(gameInstance, hud) {
    gameInstance.animatronicsActive = true;

    Object.values(Animatronics).forEach(anim => {
        (async function loop() {
            while (gameInstance.animatronicsActive) {
                const tiempo = Math.random() * (anim.intervaloMax - anim.intervaloMin) + anim.intervaloMin;
                await new Promise(resolve => setTimeout(resolve, tiempo * 1000));

                if (!gameInstance.animatronicsActive) break;

                if (anim.posicion === 8) {
                    console.log(`${anim.nombre} te atrapó!`);
                    gameInstance.setState(gameInstance.GAME_STATES.GAME_OVER);
                    gameInstance.showGameOver(anim.nombre)
                    gameInstance.animatronicsActive = false;
                    exportLogs();

                    break;
                }

                if (Math.floor(Math.random() * 20) + 1 <= anim.iaLevel) {
                    const horaActual = parseHour(hud.time);
                    anim.mover(horaActual, hud);
                }
            }
        })();
    });
}

export function stopAnimatronics(gameInstance) {
    gameInstance.animatronicsActive = false;
}
