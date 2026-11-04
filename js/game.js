const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function init() {
  const img = new Image();
  img.addEventListener("load", () => ctx.drawImage(img, 100, 300));
  img.src = "./assets/images/mage/idle/idle1.png";
}

init();
