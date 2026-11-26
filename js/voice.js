import { sound } from "./sound.js";

const LANGUAGE = "en-US";
const NARRATOR = { pitch: 0.9, rate: 0.9 };
const SPEAKERS = {
  Latch: { pitch: 1.4, rate: 1 },
  Hob: { pitch: 0.5, rate: 0.85 },
};

export default class Voice {
  speak(text, speaker) {
    if (sound.muted) return;
    const settings = SPEAKERS[speaker] || NARRATOR;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    speechSynthesis.speak(utterance);
  }

  stop() {
    speechSynthesis.cancel();
  }
}

export const voice = new Voice();
