const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.scratch-container');
const invitation = document.getElementById('invitation');

// Adjust canvas size to match the container
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

// Fill canvas with gray color
ctx.fillStyle = '#cccccc';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Scratch settings
let isScratching = false;

canvas.addEventListener('mousedown', () => {
  isScratching = true;
});

canvas.addEventListener('mouseup', () => {
  isScratching = false;
  ctx.beginPath();

  // Check if enough of the canvas is scratched
  if (isRevealed()) {
    invitation.classList.remove('hidden');
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (!isScratching) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2, false);
  ctx.fill();
});

function isRevealed() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparentPixels++; // Check alpha channel
  }

  const transparencyPercentage = (transparentPixels / (pixels.length / 4)) * 100;
  return transparencyPercentage > 50; // Reveal if 50% scratched
}
