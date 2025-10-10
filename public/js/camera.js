// -----------------------------------------------------------
// camera.js
// Handles the game's camera system: opening/closing cameras,
// playing corresponding sounds, and consuming battery while
// the player is viewing the camera.
// -----------------------------------------------------------

import { SoundManager } from "./sound_manager.js";

/**
 * Game camera system.
 * Allows opening/closing cameras, playing sounds, and consuming battery.
*/

export default class CameraSystem {

    /**
     * @param {string} cameraDivId - ID of the camera container in the DOM.
     * @param {object} hud - Player HUD to consume battery.
    */

    constructor(cameraDivId, hud) {
        this.cameraDiv = document.getElementById(cameraDivId);
        this.hud = hud;
        this.currentCamera = null;
        this.batteryInterval = null;

        this._bindSVG();        // Bind click events to each camera
        this._bindCloseHover(); // Bind hover event to close camera
    }

    /** Binds click events to all cameras (except camOF) */
    _bindSVG() {
        const cameras = this.cameraDiv.querySelectorAll("[id^='cam']");
        cameras.forEach(cam => {
            if (cam.id !== "camOF") {
                cam.addEventListener("click", () => {
                    this.currentCamera = cam.id;
                    this.showCamera(cam.id);
                });
            }
        });
    }

    /** Hides the camera when hovering over the close element */
    _bindCloseHover() {
        const closeCam = document.getElementById('hover-bottom');
        if (closeCam) {
            closeCam.addEventListener("mouseenter", () => {
                this._hide();
            });
        }
    }

    /**
     * Displays the selected camera.
     * Plays sounds and starts consuming battery.
     * @param {string} cameraId - ID of the camera to display.
     */

    showCamera(cameraId) {
        if (!this.currentCamera) this.currentCamera = "cam01";

        this.cameraDiv.style.display = "block";

        SoundManager.play("sfx", "camera_up");
        SoundManager.stop("ambience", "office");

        // Consume 1 battery point per second while the camera is open
        if (!this.batteryInterval) {
            this.batteryInterval = setInterval(() => {
                this.hud.useBattery(1);
            }, 1000);
        }

        console.log(`Mostrando cámara ${cameraId}`);
    }

    /** Closes the camera, plays sound, and stops battery consumption */
    _hide() {
        SoundManager.play("sfx", "camera_down");
        SoundManager.play("ambience", "office");

        this.cameraDiv.style.display = "none";

        if (this.batteryInterval) {
            clearInterval(this.batteryInterval);
            this.batteryInterval = null;
        }

        console.log(`Cámara cerrada`);
    }
}
