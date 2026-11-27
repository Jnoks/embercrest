import { sound } from "./sound.js";
import { INTRO_PAGES, WORLDS } from "./data/story.js";

const VOICE_PATH = "./assets/audio/voice/";
const VOICE_VOLUME = 1;
const LANGUAGE = "en-US";
const NARRATOR = { pitch: 0.9, rate: 0.9 };
const SPEAKERS = {
  Latch: { pitch: 1.4, rate: 1 },
  Hob: { pitch: 0.5, rate: 0.85 },
};

export default class Voice {
  constructor() {
    this.files = {};
    this.audio = null;
    this.addLines("intro", INTRO_PAGES);
    this.addWorld(WORLDS[0]);
  }

  addWorld(world) {
    this.addLines("arrival", world.arrival);
    this.addLines("offer", world.quest.offer);
    this.addLines("reminder", world.quest.reminder);
    this.addLines("complete", world.quest.complete);
    this.addLines("farewell", world.quest.farewell);
    this.addLines("locked", world.gate.locked);
    this.addLines("opened", world.gate.opened);
    this.addLines("boss", world.boss.intro);
    this.addLines("defeat", world.boss.defeat);
    this.addLines("cleared", world.cleared);
    this.addLines("ending", world.ending);
  }

  addLines(name, pages) {
    for (let i = 0; i < pages.length; i++) {
      this.files[pages[i]] = `${VOICE_PATH}${name}-${i + 1}.m4a`;
    }
  }

  speak(text, speaker) {
    if (sound.muted) return;
    if (this.files[text]) this.play(this.files[text]);
    else this.read(text, speaker);
  }

  play(file) {
    this.audio = new Audio(file);
    this.audio.volume = VOICE_VOLUME;
    sound.start(this.audio);
  }

  read(text, speaker) {
    const settings = SPEAKERS[speaker] || NARRATOR;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    speechSynthesis.speak(utterance);
  }

  stop() {
    speechSynthesis.cancel();
    if (this.audio) this.audio.pause();
  }
}

export const voice = new Voice();
