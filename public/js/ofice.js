// -----------------------------------------------------------
// ofice.js
// Handles the office scene logic.
// Manages camera movement (panorama), door interactions, and camera access.
// -----------------------------------------------------------

import CameraSystem from "./camera.js";


/**
 * Office scene controller.
 * Controls player interactions inside the office:
 * - Panning left/right across the room.
 * - Interacting with doors.
 * - Opening the security cameras.
 */

export default class Office {
  /**
   * @param {object} hud - Reference to the HUD instance (battery, time, etc.)
   */
  constructor(hud) {
    this.wrapper = document.getElementById("ofice__panorama");
    this.hud = hud;

    this.currentX = -100; // initial camera position (center = -100vw)
    this.interval = null;
    this.speed = 5; // camera movement speed (vw per frame)

    // Initialize interaction and camera system
    this._bindUI();
    this._updatePosition();
    this.cameraSystem = new CameraSystem("camera", this.hud);
  }

  /** Called when player clicks the left door. */
  openLeftDoor() {
    console.log("Left door clicked");
    this.hud.useBattery(1);
  }

  /** Called when player clicks the right door. */
  openRightDoor() {
    console.log("Right door clicked");
    this.hud.useBattery(1);
  }

  /** Called when player clicks the camera computer. */
  openCameras() {
    console.log("Camera computer clicked");
    this.cameraSystem.showCamera(this.cameraSystem.currentCamera);
  }

  /**
   * Binds all UI interactions (doors, cameras, and hover zones).
   */
  _bindUI() {
    // Door & camera interactions
    document.getElementById("left_door").addEventListener("click", () => this.openLeftDoor());
    document.getElementById("right_door").addEventListener("click", () => this.openRightDoor());
    document.getElementById("computer_camera").addEventListener("click", () => this.openCameras());

    // Hover zones for panning
    document.getElementById("hover-left").addEventListener("mouseenter", () => this._startMoving(1));
    document.getElementById("hover-right").addEventListener("mouseenter", () => this._startMoving(-1));
    document.getElementById("hover-left").addEventListener("mouseleave", () => this._stopMoving());
    document.getElementById("hover-right").addEventListener("mouseleave", () => this._stopMoving());
  }

  /**
   * Updates the office camera position visually.
   */
  _updatePosition() {
    this.wrapper.style.transform = `translateX(${this.currentX}vw)`;
  }

  /**
   * Starts moving the camera horizontally.
   * @param {number} direction - 1 moves right →, -1 moves left ←
   */
  _startMoving(direction) {
    this._stopMoving(); // ensure only one movement loop is active
    this.interval = setInterval(() => {
      this.currentX += direction * this.speed;

      // Keep camera movement within [0, -200vw]
      if (this.currentX > 0) this.currentX = 0;
      if (this.currentX < -200) this.currentX = -200;

      this._updatePosition();
    }, 16); // ~60fps
  }

  /**
   * Stops the current camera movement.
   */
  _stopMoving() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
