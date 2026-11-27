export const CAN_FULLSCREEN = document.fullscreenEnabled === true;

export function isFullscreen() {
  return document.fullscreenElement !== null;
}

export function toggleFullscreen() {
  if (isFullscreen()) document.exitFullscreen();
  else enterFullscreen();
}

function enterFullscreen() {
  const stage = document.querySelector(".stage");
  stage.requestFullscreen().catch(() => {});
}
