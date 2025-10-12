// -----------------------------------------------------------
// debug_console.js
// In-game debug console to test and control specific systems
// without modifying source code.
// -----------------------------------------------------------

import { startAnimatronics, stopAnimatronics } from "./animatronics.js";
import { SoundManager } from "./sound_manager.js";

/**
 * List of commands with description
 */
const COMMANDS = [
    { name: "debug animatronics", desc: "Inicia el sistema de animatronics." },
    { name: "stop animatronics", desc: "Detiene los animatronics." },
    { name: "debug hud", desc: "Simula consumo de batería y cambia la hora." },
    { name: "debug sound", desc: "Reproduce un efecto de sonido (camera_up)." },
    { name: "debug log", desc: "Muestra datos de log en consola." }
];

/**
 * Initializes an interactive debug console.
 * Press `~` or `F2` to toggle visibility.
 * @param {object} gameInstance - Main game instance.
 */


export function initDebugConsole(gameInstance) {
    const consoleEl = document.createElement("div");
    consoleEl.id = "debug-console";
    consoleEl.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.8);
    color: #00ff99;
    font-family: monospace;
    font-size: 14px;
    padding: 8px;
    display: none;
    z-index: 9999;
    box-shadow: 0 -2px 8px rgba(0,255,150,0.2);
  `;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter debug command...";
    input.style.cssText = `
    width: 100%;
    background: transparent;
    color: #00ff99;
    border: none;
    outline: none;
    font-size: 14px;
  `;

    const suggestionsBox = document.createElement("div");
    suggestionsBox.style.cssText = `
    position: absolute;
    bottom: 35px;
    left: 8px;
    background: rgba(10,10,10,0.98);
    border: 1px solid #00ff99;
    border-radius: 6px;
    color: #00ff99;
    font-family: monospace;
    width: calc(100% - 16px);
    max-height: 160px;
    overflow-y: auto;
    display: none;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;

    consoleEl.appendChild(input);
    consoleEl.appendChild(suggestionsBox);
    document.body.appendChild(consoleEl);

    let visible = false;
    let selectedIndex = -1;

    // Toggle console with ~ or F2
    window.addEventListener("keydown", (e) => {
        if (e.key === "`" || e.key === "F2") {
            visible = !visible;
            consoleEl.style.display = visible ? "block" : "none";
            if (visible) input.focus();
        } else if (visible && e.key === "Escape") {
            consoleEl.style.display = "none";
            visible = false;
        }
    });

    // Show suggestions
    input.addEventListener("input", () => {
        const value = input.value.trim().toLowerCase();
        const matches = COMMANDS.filter(cmd => cmd.name.toLowerCase().includes(value));

        suggestionsBox.innerHTML = "";
        selectedIndex = -1;

        if (matches.length && value) {
            matches.forEach((cmd, i) => {
                const item = document.createElement("div");
                item.innerHTML = `
          <div style="display: flex; flex-direction: column; padding: 6px 8px;">
            <span style="color: #00ffaa; font-weight: bold;">${cmd.name}</span>
            <span style="color: #66ffcc; font-size: 12px; opacity: 0.8;">${cmd.desc}</span>
          </div>
        `;
                item.style.cursor = "pointer";
                item.addEventListener("mouseover", () => {
                    selectedIndex = i;
                    updateSelection();
                });
                item.addEventListener("click", () => {
                    executeCommand(cmd.name);
                });
                suggestionsBox.appendChild(item);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    // Keyboard navigation
    input.addEventListener("keydown", (e) => {
        const items = suggestionsBox.querySelectorAll("div");
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection();
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection();
            e.preventDefault();
        } else if (e.key === "Enter") {
            const cmd =
                selectedIndex >= 0
                    ? items[selectedIndex].querySelector("span").textContent
                    : input.value.trim();
            executeCommand(cmd);
        }
    });

    function executeCommand(cmd) {
        if (!cmd) return;
        handleDebugCommand(cmd, gameInstance);
        input.value = "";
        suggestionsBox.style.display = "none";
    }

    function updateSelection() {
        const items = suggestionsBox.querySelectorAll("div");
        items.forEach((item, i) => {
            item.style.background = i === selectedIndex ? "rgba(0,255,150,0.15)" : "transparent";
        });
        if (selectedIndex >= 0) {
            items[selectedIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }
}

/**
 * Run debug commands.
 */
function handleDebugCommand(cmd, game) {
    console.log(`[DEBUG] Command: ${cmd}`);

    switch (cmd.toLowerCase()) {
        case "debug animatronics":
            startAnimatronics(game, game.hud);
            break;

        case "stop animatronics":
            stopAnimatronics(game);
            break;

        case "debug hud":
            game.hud.useBattery(10);
            game.hud.setTime("3 AM");
            break;

        case "debug sound":
            SoundManager.play("sfx", "camera_up");
            break;

        case "debug log":
            console.table(game.logData || []);
            break;

        default:
            console.warn(`[DEBUG] Unknown command: "${cmd}"`);
    }
}
