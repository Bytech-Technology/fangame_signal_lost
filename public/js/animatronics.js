// -----------------------------------------------------------
// animatronics.js
// Controls animatronics AI logic and movement.
// -----------------------------------------------------------

import { MAP_LOCATIONS } from "./config.js";
import { logMovement, exportLogs } from "./logger.js";
import { SoundManager } from "./sound_manager.js";

// ===========================================================
// Base class for animatronics
// ===========================================================

/**
 * Represents an animatronic with movement logic.
*/

class Animatronic {
    
    /**
     * @param {string} name - Animatronic name.
     * @param {number} spawn - Initial map position.
     * @param {number} iaLevel - AI level (chance to move).
     * @param {number} intervalMin - Minimum interval between moves (seconds).
     * @param {number} intervalMax - Maximum interval between moves (seconds).
     * @param {object} routes - Possible movement routes between positions.
     * @param {number[]} soundZones - Zones where movement produces sound.
    */

    constructor(nombre, spawn, iaLevel, intervaloMin, intervaloMax, rutas, zonasSonido) {
        this.nombre = nombre;
        this.spawn = spawn;
        this.posicion = spawn;
        this.iaLevel = iaLevel;
        this.intervaloMin = intervaloMin;
        this.intervaloMax = intervaloMax;
        this.rutas = rutas;
        this.zonasSonido = zonasSonido || [];
    }

    /**
     * Attempts to move the animatronic based on AI and current game time.
     * @param {number} currentHour - Current game hour (0 to 6 AM).
     * @param {object} hud - Player HUD (battery, time, etc.).
    */

    mover(horaActual, hud) {
        const posibles = this.rutas[this.posicion] || [];
        const oldPos = this.posicion;

        if (posibles.length === 0) return;
        if (this.nombre === "Freddy" && horaActual < 3) return; // Freddy moves only after 3 AM

        // Freddy always moves; others may stay in place
        let nuevaPosicion;
        if (this.nombre === "Freddy") {
            nuevaPosicion = posibles[Math.floor(Math.random() * posibles.length)];
        } else {
            const opciones = [...posibles, this.posicion];
            nuevaPosicion = opciones[Math.floor(Math.random() * opciones.length)];
        }

        this.posicion = nuevaPosicion;

        // Play footsteps if entering a sound zone
        if (this.zonasSonido.includes(this.posicion)) {
            SoundManager.play("animatronics", this.nombre, "steps");
        }

        // Log movement
        logMovement(this.nombre, oldPos, this.posicion, hud.time, MAP_LOCATIONS);
    }

    /** Resets the animatronic to its initial spawn position. */
    regresarSpawn() {
        this.posicion = this.spawn;
    }
}

// ===========================================================
// Animatronic instances and routes
// ===========================================================

export const Animatronics = {
    Freddy: new Animatronic("Freddy", 2, 8, 20, 40, {
        2: [1], 1: [3], 3: [4], 4: [8]
    }, [1, 2, 3, 4]),

    Foxy: new Animatronic("Foxy", 7, 12, 15, 30, {
        7: [6], 6: [4, 7], 4: [8, 6]
    }, [4]),

    Chica: new Animatronic("Chica", 2, 10, 10, 25, {
        2: [1], 1: [6, 2], 6: [4, 1], 4: [8, 6]
    }, [6, 4]),

    Bonnie: new Animatronic("Bonnie", 2, 9, 10, 25, {
        2: [6], 6: [5, 2], 5: [7, 6], 7: [4, 5], 4: [8, 7]
    }, [4, 6])
};

// ===========================================================
// Utilities
// ===========================================================

/** Converts a time string like "12 AM" to a number (0 = midnight). */
function parseHour(timeStr) {
    const num = parseInt(timeStr.split(" ")[0], 10);
    return num === 12 ? 0 : num;
}

// ===========================================================
// AI and movement system
// ===========================================================

/**
 * Starts movement loops for all animatronics.
 * Each animatronic moves independently based on AI.
 */
export function startAnimatronics(gameInstance, hud) {
    if(!window.DEV_MODE){
        console.warn("⚙️ Animatronics disabled in DEV_MODE");
        return;
    }
    
    gameInstance.animatronicsActive = true;

    Object.values(Animatronics).forEach(anim => {
        (async function loop() {
            while (gameInstance.animatronicsActive) {
                // Wait a random interval before attempting to move
                const tiempo = Math.random() * (anim.intervaloMax - anim.intervaloMin) + anim.intervaloMin;
                await new Promise(resolve => setTimeout(resolve, tiempo * 1000));

                if (!gameInstance.animatronicsActive) break;

                // Trigger "catch" event if reaching position 8
                if (anim.posicion === 8) {
                    if (hud.battery <= 0 && anim.nombre !== "Freddy") continue;

                    console.log(`${anim.nombre} te atrapó!`);
                    gameInstance.animatronicsActive = false;    

                    const deathSong = SoundManager.channels.animatronics[anim.nombre].death;
                    if (deathSong) {
                        deathSong.play();
                        SoundManager.once("animatronics", anim.nombre, "death", () => {
                            if (gameInstance.state !== gameInstance.GAME_STATES.NEXT_DAY) {
                                SoundManager.play("sfx", "death");
                                gameInstance.showGameOver(anim.nombre);
                                gameInstance.setState(gameInstance.GAME_STATES.GAME_OVER);
                            }
                        });
                    } else {
                        if (gameInstance.state !== gameInstance.GAME_STATES.NEXT_DAY) {
                            SoundManager.play("sfx", "death");
                            gameInstance.showGameOver(anim.nombre);
                            gameInstance.setState(gameInstance.GAME_STATES.GAME_OVER);
                        }
                    }

                    exportLogs();
                    break;
                }

                // AI decides whether to move
                if (Math.floor(Math.random() * 20) + 1 <= anim.iaLevel) {
                    const horaActual = parseHour(hud.time);
                    anim.mover(horaActual, hud);
                }
            }
        })();
    });
}

/** Stops all animatronic activity. */
export function stopAnimatronics(gameInstance) {
    gameInstance.animatronicsActive = false;
}
