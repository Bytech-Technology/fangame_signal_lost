// -----------------------------------------------------------
// HUD.js
// Manages the user interface: battery, clock, and events
// related to energy and game time.
// Handles battery drain, updates the UI, and manages game limits
// (e.g., 6 AM or zero battery).
// -----------------------------------------------------------

import { SoundManager } from "./sound_manager.js";

export default class HUD {

  /**
   * @param {object} game - Main game instance.
   */
  
  constructor(game) {
    this.game = game; // reference to the main game instance

    this.battery = 100;
    this.time = "12 AM";

    this.batteryON = document.getElementById("battery-on");
    this.batteryBar = document.getElementById("battery_power");
    this.batteryOffImg = document.getElementById("battery-off");
    this.batteryEl = document.getElementById("battery-value");
    this.timeEl = document.getElementById("time-value");

    this._startBatteryDrain(); // start automatic battery drain
    this._startClock();        // start the game clock
    this._updateUI();          // update initial UI
  }

  /** Drains battery periodically (1% every 10 seconds) */
  _startBatteryDrain() {
    this.batteryInterval = setInterval(() => {
      this.battery = Math.max(0, this.battery - 1);
      this._updateUI();
    }, 10000); // decrease 1% every 10 seconds
  }

  /** Starts the game clock and updates minutes/hours automatically */
  _startClock() {
    let hour = 12;
    let minute = 0;
    let isAM = true;

    this.time = "12:00 AM";
    this._updateUI();

    this.clockInterval = setInterval(() => {
      let displayHour = hour < 10 ? `0${hour}` : hour;
      let displayMinute = minute < 10 ? `0${minute}` : minute;
      this.time = `${displayHour}:${displayMinute} ${isAM ? 'AM' : 'PM'}`;
      this._updateUI();

      // Increment minute
      minute++;
      if (minute > 59) {
        minute = 0;
        hour++;
        if (hour === 12) isAM = !isAM;
        else if (hour > 12) hour = 1;
      }

      // Game limit (6 AM)
      if (hour === 6 && isAM) {
        clearInterval(this.clockInterval);
        this.game.setState(this.game.GAME_STATES.NEXT_DAY);
      }
    }, 2000);
  }

  
  /**
   * Calculates battery bar color based on battery percentage.
   * @param {number} percent - Battery percentage (0-100)
   * @returns {string} RGB color string
   */

  _getBatteryColor(percent) {
    let start, end, rangeStart, rangeEnd;

    if (percent >= 50) {
      // green → orange (50-100%)
      start = [72, 255, 106];
      end = [241, 156, 27];
      rangeStart = 100;
      rangeEnd = 50;
    } else {
      // orange → red (0-50%)
      start = [241, 156, 27];
      end = [245, 59, 59];
      rangeStart = 50;
      rangeEnd = 0;
    }

    const t = (percent - rangeStart) / (rangeEnd - rangeStart);

    const r = Math.round(start[0] + (end[0] - start[0]) * t);
    const g = Math.round(start[1] + (end[1] - start[1]) * t);
    const b = Math.round(start[2] + (end[2] - start[2]) * t);

    return `rgb(${r},${g},${b})`;
  }

  /** Updates all HUD visual elements */
  _updateUI() {
    this.batteryEl.textContent = `${this.battery}%`;
    this.timeEl.textContent = this.time;

    const maxWidth = 419.724;
    const newWidth = (this.battery / 100) * maxWidth;
    this.batteryBar.setAttribute("width", newWidth);

    // Show or hide battery icons based on battery state
    if (this.battery <= 0) {
      this.batteryON.style.display = "none";
      this.batteryOffImg.style.display = "block";

      if (!this._gameOverTriggered) {
        this._gameOverTriggered = true;
        clearInterval(this.batteryInterval);
        this.game.onlyFreddyActive = true;

        SoundManager.play("sfx", "powerdown");
        
        SoundManager.once("sfx", "powerdown", null, () =>{
          const deathSong = SoundManager.channels.animatronics["Freddy"].death;
          deathSong.play();

          SoundManager.once("animatronics", "Freddy", "death", () =>{
            const delay = 1000 + Math.random() * 2000;
            setTimeout(() =>{
              if (this.game.state !== this.game.GAME_STATES.NEXT_DAY) {
                SoundManager.play("sfx", "death");  
                this.game.showGameOver("Freddy");
                this.game.setState(this.game.GAME_STATES.GAME_OVER);
              }
            }, delay); 
          });
        });
      };

    } else {
      this.batteryON.style.display = "block";
      this.batteryOffImg.style.display = "none";
    }

    // Update color based on battery level
    if (this.battery > 0) {
      const color = this._getBatteryColor(this.battery);
      this.batteryBar.setAttribute("fill", color);
    }
  }

  /** Sets the current time and updates the UI */
  setTime(newTime) {
    this.time = newTime;
    this._updateUI();
  }

  /** Consumes a specific amount of battery and updates the UI */
  useBattery(amount) {
    if (this.battery <= 0) return;
    this.battery = Math.max(0, this.battery - amount);
    this._updateUI();

  }
}
