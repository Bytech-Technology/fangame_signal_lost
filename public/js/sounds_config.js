export const SoundsConfig = {
  animatronics: {
    Freddy: {
      steps: "freddy_steps.mp3",
      death: "freddy_death.mp3"
    },
    Bonnie: {
      steps: "bonnie_steps.mp3",
      death: "bonnie_death.mp3"
    },
    Chica:{
        steps: "chica_steps.mp3",
        death: "chica_death.mp3"
    },
    Foxy:{
        steps: "foxy_steps.mp3",
        death: "foxy_death.mp3"
    }
    
  },
  ambience: {
    office: { src: "office_hum.mp3", loop: true },
    night: { src: "ambiente.ogg", loop: true },
    intro: { src: "intro.mp3" }
  },
  sfx: {
    door: "door_close.mp3",
    light: "light_switch.mp3",
    camera: "camara_sound.mp3",
    powerdown: "powerdown.mp3",
    death: "jumpscare.mp3",
    victory: "victoria_time.mp3"
  }
};
