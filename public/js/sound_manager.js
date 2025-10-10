// -----------------------------------------------------------
// sound_manager.js
// Handles all game audio logic — ambience, SFX, and animatronic sounds.
// Uses Howler.js for playback and dynamic volume control.
// -----------------------------------------------------------

import { SoundsConfig } from "./sounds_config.js";

class SoundManagerClass {
  constructor() {
    // Minimum volume allowed to avoid silent playback
    this.MIN_VOLUME = 0.1;

    // Current volume settings (loaded from localStorage or defaults)
    this.volumes = {
      ambience: Math.max(parseFloat(localStorage.getItem("ambienceVolume")) || 1, this.MIN_VOLUME),
      sfx: Math.max(parseFloat(localStorage.getItem("sfxVolume")) || 1, this.MIN_VOLUME)
    };

    // Sound channels for organization
    this.channels = {
      animatronics: {},
      ambience: {},
      sfx: {}
    };

    this.introPlaying = false; // True when intro ambience is playing
    this._ducked = false;      // Used to temporarily reduce ambience volume
  }
  /** Initializes all sound channels from SoundsConfig. */s
  init() {

    // ---------------------------
    // Animatronic sounds
    // ---------------------------

    Object.entries(SoundsConfig.animatronics).forEach(([animName, sound]) => {
      this.channels.animatronics[animName] = {};
      Object.entries(sound).forEach(([key, file]) => {
        this.channels.animatronics[animName][key] = new Howl({
          src: [`sounds/animatronics/${file}`],
          volume: 1.0
        });
      });
    });

    // ---------------------------
    // Ambience sounds
    // ---------------------------

    Object.entries(SoundsConfig.ambience).forEach(([key, cfg]) => {
      this.channels.ambience[key] = new Howl({
        src: [`sounds/ambience/${cfg.src}`],
        loop: cfg.loop || false,
        volume: (cfg.volume !== undefined ? cfg.volume : 1.0) * this.volumes.ambience
      });
    });

    // ---------------------------
    // Sound effects (SFX)
    // ---------------------------

    Object.entries(SoundsConfig.sfx).forEach(([key, file]) => {
      this.channels.sfx[key] = new Howl({
        src: [`sounds/sfx/${file}`],
        volume: this.volumes.sfx
      });
    });
  }

  /** Plays a sound from a given channel. */
  play(channel, soundKey, subKey = null) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];

    if (sound) {
      // Temporarily lower ambience volume when animatronics play
      if (channel === "animatronics") {
        this.duckAmbience();
        sound.once("end", () => this.restoreAmbience());
      }
      sound.play();
    }
  }

  /** Stops a sound immediately. */
  stop(channel, soundKey, subKey = null) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];
    if (sound) sound.stop();
  }

  /**
   * Executes a callback after a sound finishes playing.
   * Useful for sequencing sounds or syncing events.
   */
  once(channel, soundKey, subKey = null, callback) {
    let sound;
    if (subKey) sound = this.channels[channel]?.[soundKey]?.[subKey];
    else sound = this.channels[channel]?.[soundKey];
    if (!sound) return;

    if (typeof sound.once === "function") {
      sound.once("end", callback);
    } else if (typeof sound.on === "function" && typeof sound.off === "function") {
      const handler = function () {
        sound.off("end", handler);
        callback();
      };
      sound.on("end", handler);
    } else {
      // Fallback for non-Howler sound objects
      const durMs = Math.round((sound.duration ? sound.duration() : 0) * 1000);
      setTimeout(callback, durMs || 1000);
    }
  }

  /**
   * Sets the volume for a given channel.
   * Persists values in localStorage.
   */
  setVolume(channel, value) {
    if (channel === "animatronics") return;
    if (channel === "ambience" && this.introPlaying) {
      console.log("ignorando cambio de volumen, intro en curso...")
      return;
    }

    const safeValue = Math.max(value, this.MIN_VOLUME);
    this.volumes[channel] = safeValue;
    localStorage.setItem(`${channel}Volume`, safeValue);

    // Apply to all loaded sounds in the channel
    if (this.channels[channel]) {
      Object.values(this.channels[channel]).forEach(sound => {
        if (sound && typeof sound.volume === "function") sound.volume(safeValue);
      });
    }
  }

  /** Temporarily lowers ambience volume (used during animatronic sounds). */
  duckAmbience() {
    if (this._ducked) return;
    this._ducked = true;

    Object.values(this.channels.ambience).forEach(sound => {
      if (sound && typeof sound.volume === "function") {
        sound.volume(this.volumes.ambience * 0.3);
      }
    })
  };

  /** Restores ambience volume after it was ducked. */
  restoreAmbience() {
    if (!this._ducked) return;
    this._ducked = false;

    Object.values(this.channels.ambience).forEach(sound => {
      if (sound && typeof sound.volume === "function") {
        sound.volume(this.volumes.ambience);
      }
    })
  }
}

// Export as singleton
export const SoundManager = new SoundManagerClass();
