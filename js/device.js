const PORTRAIT = window.matchMedia(
  "(pointer: coarse) and (orientation: portrait)",
);

export const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;

export function isPortrait() {
  return PORTRAIT.matches;
}
