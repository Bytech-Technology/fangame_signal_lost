// sound_manager.js
import { SoundsConfig } from "./sounds_config.js";

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
    // Animatronics
   Object.entries(SoundsConfig.animatronics).forEach(([animName, sound]) =>{
    this.channels.animatronics[animName] = {};
    Object.entries(sound).forEach(([key, file]) =>{
      this.channels.animatronics[animName][key] = new Howl({
        src: [`sounds/animatronics/${file}`],
        volume: 1.0
      });
    });
   });

    // Ambience
     Object.entries(SoundsConfig.ambience).forEach(([key, cfg]) => {
      this.channels.ambience[key] = new Howl({
        src: [`sounds/ambience/${cfg.src}`],
        loop: cfg.loop || false,
        volume: (cfg.volume !== undefined ? cfg.volume : 1.0) * this.volumes.ambience
      });
    });

    // SFX
    Object.entries(SoundsConfig.sfx).forEach(([key, file]) => {
      this.channels.sfx[key] = new Howl({
        src: [`sounds/sfx/${file}`],
        volume: this.volumes.sfx
      });
    });
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
