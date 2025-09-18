import { SoundManager } from "./sound_manager.js";

// HUD.js
export default class HUD {
  constructor(game) {
    this.game = game; // referencia a la instancia de game

    this.battery = 100;
    this.time = "12 AM";

    this.batteryON = document.getElementById("battery-on");
    this.batteryBar = document.getElementById("battery_power");
    this.batteryOffImg = document.getElementById("battery-off");
    this.batteryEl = document.getElementById("battery-value");
    this.timeEl = document.getElementById("time-value");

    this._startBatteryDrain();
    this._startClock();
    this._updateUI();
  }

  _startBatteryDrain() {
    this.batteryInterval = setInterval(() => {
      this.battery = Math.max(0, this.battery - 1);
      this._updateUI();

      //if (this.battery === 0) {
      //  clearInterval(this.batteryInterval);
      //  this.game.setState(this.game.GAME_STATES.GAME_OVER);
      //}
    }, 10000); // baja 1% cada 10s
  }

  _startClock() {
    // hora y minuto iniciales
    let hour = 12;
    let minute = 0;
    let isAM = true;

    this.time = "12:00 AM";
    this._updateUI();
    this.clockInterval = setInterval(() => {
      // Formatear hora y minuto
      let displayHour = hour < 10 ? `0${hour}` : hour;
      let displayMinute = minute < 10 ? `0${minute}` : minute;
      this.time = `${displayHour}:${displayMinute} ${isAM ? 'AM' : 'PM'}`;
      this._updateUI();

      // Avanzar minuto
      minute++;

      if (minute > 59) {
        minute = 0;
        hour++;

        // Cambiar AM/PM
        if (hour === 12) {
          isAM = !isAM;
        } else if (hour > 12) {
          hour = 1;
        }
      }

      // Límite del juego (6 AM)
      if (hour === 6 && isAM) {
        clearInterval(this.clockInterval);
        this.game.setState(this.game.GAME_STATES.NEXT_DAY);
      }

    }, 2000);
  }

  _getBatteryColor(percent) {
    let start, end, rangeStart, rangeEnd;

    if (percent >= 50) {
      // verde → naranja (50-100%)
      start = [72, 255, 106];   // #48FF6A
      end = [241, 156, 27];     // #f19c1b
      rangeStart = 100;
      rangeEnd = 50;
    } else {
      // naranja → rojo (0-50%)
      start = [241, 156, 27];   // #f19c1b
      end = [245, 59, 59];      // #f53b3b
      rangeStart = 50;
      rangeEnd = 0;
    }

    const t = (percent - rangeStart) / (rangeEnd - rangeStart); // interpolación 0→1

    const r = Math.round(start[0] + (end[0] - start[0]) * t);
    const g = Math.round(start[1] + (end[1] - start[1]) * t);
    const b = Math.round(start[2] + (end[2] - start[2]) * t);

    return `rgb(${r},${g},${b})`;
  }

  _updateUI() {
    this.batteryEl.textContent = `${this.battery}%`;
    this.timeEl.textContent = this.time;

    // Calcular ancho dinámico
    const maxWidth = 419.724;
    const newWidth = (this.battery / 100) * maxWidth;

    this.batteryBar.setAttribute("width", newWidth);

    if (this.battery <= 0) {
      this.batteryON.style.display = "none";
      this.batteryOffImg.style.display = "block";

      // Si aún no hicimos la animación final
      if (!this._gameOverTriggered) {
        this._gameOverTriggered = true; // flag para no repetir
        clearInterval(this.batteryInterval); // parar consumo

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

    // Cambiar color según nivel
    if (this.battery > 0) {
      const color = this._getBatteryColor(this.battery);
      this.batteryBar.setAttribute("fill", color);
    }
  }

  setTime(newTime) {
    this.time = newTime;
    this._updateUI();
  }

  useBattery(amount) {
    if (this.battery <= 0) return;
    this.battery = Math.max(0, this.battery - amount);
    this._updateUI();

  }
}
