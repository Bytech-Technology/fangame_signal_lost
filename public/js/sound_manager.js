// sound_manager.js
import { Animatronics } from "./animatronics.js";

class SoundManagerClass {
  constructor() {
    this.MIN_VOLUME = 0.1;

    this.volumes = {
      ambience: Math.max(parseFloat(localStorage.getItem("ambienceVolume")) || 1, this.MIN_VOLUME),
      sfx: Math.max(parseFloat(localStorage.getItem("sfxVolume")) || 1, this.MIN_VOLUME)
    };

    this.channels = {
      animatronics: {},
      ambience: {},
      sfx: {}
    };
  }

  init() {
    // cargar animatronics
    Object.values(Animatronics).forEach(anim => {
      this.channels.animatronics[anim.nombre] = {
        steps: new Howl({
          src: [`sounds/animatronics/${anim.pasosSonido}`],
          volume: 1.0
        }),
        death: new Howl({
          src: [`sounds/animatronics/${anim.cancionMuerte}`],
          volume: 1.0
        })
      };
    });

    // Ambience
    this.channels.ambience = {
      office: new Howl({
        src: ["sounds/ambience/office_hum.mp3"],
        loop: true,
        volume: this.volumes.ambience
      }),
      night: new Howl({
        src: ["sounds/ambience/ambience_night.mp3"],
        loop: true,
        volume: this.volumes.ambience
      }),
      intro: new Howl({
        src: ["sounds/ambience/intro.mp3"],
        volume: this.volumes.ambience
      })
    };

    // SFX
    this.channels.sfx = {
      door: new Howl({
        src: ["sounds/sfx/door_close.mp3"],
        volume: this.volumes.sfx
      }),
      light: new Howl({
        src: ["sounds/sfx/light_switch.mp3"],
        volume: this.volumes.sfx
      }),
      camera: new Howl({
        src: ["sounds/sfx/camara_sound.mp3"],
        volume: this.volumes.sfx
      }),
      powerdown: new Howl({
        src: ["sounds/sfx/powerdown.mp3"],
        volume: this.volumes.sfx
      }),
      death: new Howl({
        src: ["sounds/sfx/jumpscare.mp3"],
        volume: this.volumes.sfx
      }),
      victory: new Howl({
        src: ["sounds/sfx/victoria_time.mp3"],
        volume: this.volumes.sfx
      })
    };
  }

  // play simple
  play(channel, soundKey, subKey = null) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];
    if (sound) sound.play();
  }

  stop(channel, soundKey, subKey = null) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];
    if (sound) sound.stop();
  }

  once(channel, soundKey, subKey = null, callback) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];

    if (!sound) return;

    if (typeof sound.once === "function") {
      sound.once("end", callback);
    } else if (typeof sound.on === "function" && typeof sound.off === "function") {
      const handler = function() {
        sound.off("end", handler);
        callback();
      };
      sound.on("end", handler);
    } else { 
      const durMs = Math.round((sound.duration ? sound.duration() : 0) * 1000);
      setTimeout(callback, durMs || 1000);
    }
  }

  setVolume(channel, value) {
    if (channel === "animatronics") return;

    const safeValue = Math.max(value, this.MIN_VOLUME);
    this.volumes[channel] = safeValue;
    localStorage.setItem(`${channel}Volume`, safeValue);

    if (this.channels[channel]) {
      Object.values(this.channels[channel]).forEach(sound => {
        if (sound && typeof sound.volume === "function") sound.volume(safeValue);
      });
    }
  }
}

export const SoundManager = new SoundManagerClass();
