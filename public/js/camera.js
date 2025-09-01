export default class CameraSystem {
    constructor(cameraDivId, hud) {
        this.cameraDiv = document.getElementById(cameraDivId);
        this.hud = hud; // HUD para consumir batería
        this.currentCamera = null;
        this.batteryInterval = null;
        this._bindSVG();
        this._bindCloseHover();
    }
    
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

    _bindCloseHover() {
        const closeCam = document.getElementById('hover-bottom');
        if(closeCam) {
            closeCam.addEventListener("mouseenter", () => {
                this._hide();
            });
        }
    }

    showCamera(cameraId) {
        // Mantener la cámara actual si ya había una seleccionada
        if (!this.currentCamera) this.currentCamera = "cam01";

        this.cameraDiv.style.display = "block";
        
        // Consumir batería 1 por segundo mientras la cámara esté abierta
        if (!this.batteryInterval){
            this.batteryInterval = setInterval(() => {
                this.hud.useBattery(1); // <-- ahora 1 por segundo
            }, 1000);
        }
      
        console.log(`Mostrando cámara ${cameraId}`);
    }

    _hide() {
        this.cameraDiv.style.display = "none";
        

        if (this.batteryInterval){
            clearInterval(this.batteryInterval);
            this.batteryInterval = null;
        }
        console.log(`Cámara cerrada`);
    }
}
