const SFX_PATH = "./assets/audio/sfx/";
const MUSIC_PATH = "./assets/audio/music/";
const EFFECT_VOLUME = 0.25;
const MUSIC_VOLUME = 0.08;
const MUTE_KEY = "embercrest-muted";
const TRACKS = ["forest", "boss"];
const EFFECTS = [
  "jump",
  "cast",
  "hit",
  "defeat",
  "hurt",
  "death",
  "shard",
  "heart",
  "checkpoint",
  "crack",
  "break",
  "ice",
  "thunder",
  "fire",
  "roar",
  "web",
  "ring",
  "unlock",
  "page",
  "click",
  "win",
  "swing",
  "snap",
  "block",
  "goblin",
  "chief",
  "ent",
  "dino",
  "spider",
  "mosquito",
  "beholder",
];

export default class Sound {
  constructor() {
    this.muted = localStorage.getItem(MUTE_KEY) === "true";
    this.effects = this.load(SFX_PATH, ".wav", EFFECTS, EFFECT_VOLUME, false);
    this.tracks = this.load(MUSIC_PATH, ".m4a", TRACKS, MUSIC_VOLUME, true);
    this.track = null;
  }

  load(path, type, names, volume, loop) {
    const sounds = {};
    for (let i = 0; i < names.length; i++) {
      const audio = new Audio(path + names[i] + type);
      audio.volume = volume;
      audio.loop = loop;
      sounds[names[i]] = audio;
    }
    return sounds;
  }

  start(audio) {
    audio.play().catch(() => {});
  }

  play(name) {
    if (this.muted) return;
    this.effects[name].currentTime = 0;
    this.start(this.effects[name]);
  }

  playMusic(name) {
    const track = this.tracks[name];
    if (this.track === track) return;
    if (this.track) this.track.pause();
    this.track = track;
    this.track.currentTime = 0;
    this.resume();
  }

  resume() {
    if (this.muted || !this.track) return;
    this.start(this.track);
  }

  pause() {
    if (this.track) this.track.pause();
  }

  stopMusic() {
    this.pause();
    this.track = null;
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem(MUTE_KEY, String(this.muted));
    if (this.muted) this.pause();
    else this.resume();
  }
}

export const sound = new Sound();
