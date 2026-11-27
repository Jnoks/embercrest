const SAVE_KEY = "embercrest-save";

export function loadSave() {
  const text = localStorage.getItem(SAVE_KEY);
  if (text === null) return null;
  return JSON.parse(text);
}

export function storeSave(progress) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
