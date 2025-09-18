export const SoundsConfig = {
  animatronics: {
    Bonnie: { steps: "bonnie_steps.mp3", death: "bonnie_death.mp3" },
    Chica:  { steps: "chica_steps.mp3",  death: "chica_death.mp3" },
    Foxy:   { steps: "foxy_steps.mp,3",   death: "foxy_death.mp3" },
    Freddy: { steps: "freddy_steps.mp3", death: "freddy_death.mp3" }
    
  },
  ambience: {
    intro:  { src: "intro.mp3", volume : 1.0 },
    menu:   { src: "menu.ogg", loop: true, volume: 1.0 },
    office: { src: "office.ogg", loop: true, volume: 0.2 },
    night:  { src: "ambiente.ogg", loop: true, volume: 0.2 }
  },
  sfx: {
    //door: "door_close.mp3",
    //light: "light_switch.mp3",
    powerdown: "powerdown.mp3",
    death: "jumpscare.mp3",
    victory: "victoria_time.mp3",
    camera_up: "camara_up.ogg",
    camera_down: "camara_down.ogg"  
  }
};
