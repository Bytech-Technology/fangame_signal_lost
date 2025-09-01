// ofice.js
import CameraSystem from "./camera.js"; 

export default class Office {
  constructor(hud) {
    this.wrapper = document.getElementById("ofice__panorama");
    this.hud = hud;

    this.currentX = -100; // posición inicial en vw (centro = -100vw)
    this.interval = null;
    this.speed = 5; // velocidad (vw por frame)

    // inicializar eventos
    this._bindUI();
    this._updatePosition();
    this.cameraSystem = new CameraSystem("camera",this.hud);
  }

  /** ----------------- PUBLIC API ----------------- **/

  openLeftDoor() {
    console.log("Left door clicked");
    this.hud.useBattery(1);
  }

  openRightDoor() {
    console.log("Right door clicked");
    this.hud.useBattery(1);
  }

  openCameras() {
    console.log("Camera computer clicked");
    this.cameraSystem.showCamera(this.cameraSystem.currentCamera);
  }

  /** ----------------- INTERNAL METHODS ----------------- **/

  _bindUI() {
    document.getElementById("left_door").addEventListener("click", () => this.openLeftDoor());
    document.getElementById("right_door").addEventListener("click", () => this.openRightDoor());
    document.getElementById("computer_camera").addEventListener("click", () => this.openCameras());

    // Hover zonas
    document.getElementById("hover-left").addEventListener("mouseenter", () => this._startMoving(1));
    document.getElementById("hover-right").addEventListener("mouseenter", () => this._startMoving(-1));
    document.getElementById("hover-left").addEventListener("mouseleave", () => this._stopMoving());
    document.getElementById("hover-right").addEventListener("mouseleave", () => this._stopMoving());
  }

  _updatePosition() {
    this.wrapper.style.transform = `translateX(${this.currentX}vw)`;
  }

  _startMoving(direction) {
    this._stopMoving(); // aseguro que no haya dos intervals
    this.interval = setInterval(() => {
      this.currentX += direction * this.speed;

      // limitar a rango [0, -200]
      if (this.currentX > 0) this.currentX = 0;
      if (this.currentX < -200) this.currentX = -200;

      this._updatePosition();
    }, 16); // ~60fps
  }

  _stopMoving() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
