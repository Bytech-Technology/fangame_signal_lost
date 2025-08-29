// HUD.js
export default class HUD {
  constructor(game) {
    this.game = game; // referencia a la instancia de game

    this.battery = 100;
    this.time = "12 AM";

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

      if (this.battery === 0) {
        clearInterval(this.batteryInterval);
        this.game.setState(this.game.GAME_STATES.GAME_OVER);
      }
    }, 10000); // baja 1% cada 10s
  }

  _startClock() {
    // ejemplo: avanza 1 hora cada 30s (puedes ajustar)
    const times = ["12 AM","01 AM","02 AM","03 AM","04 AM","05 AM","06 AM"];
    let index = 0;

    this.clockInterval = setInterval(() => {
      this.time = times[index];
      this._updateUI();

      if (this.time === "06 AM") {
        clearInterval(this.clockInterval);
        this.game.setState(this.game.GAME_STATES.NEXT_DAY); // o lo que quieras
      }

      index = (index + 1) % times.length;
    }, 30000);
  }

  _updateUI() {
    this.batteryEl.textContent = `${this.battery}%`;
    this.timeEl.textContent = this.time;
  }

  setTime(newTime) {
    this.time = newTime;
    this._updateUI();
  }
}
