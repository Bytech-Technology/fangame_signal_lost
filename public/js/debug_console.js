// -----------------------------------------------------------
// debug_console.js
// In-game debug console to test and control specific systems
// without modifying source code.
// -----------------------------------------------------------

import { startAnimatronics, stopAnimatronics } from "./animatronics.js";
import { SoundManager } from "./sound_manager.js";

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
  `;

  consoleEl.appendChild(input);
  document.body.appendChild(consoleEl);

  let visible = false;

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

  // Handle command execution
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      handleDebugCommand(cmd, gameInstance);
      input.value = "";
    }
  });
}

/**
 * Handles debug commands entered in the console.
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
