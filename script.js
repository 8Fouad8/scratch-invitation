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

// Helper function to get touch/mouse position
function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  if (event.touches) {
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}

// Start scratching
function startScratch(event) {
  isScratching = true;
  scratch(event);
}

// Stop scratching
function stopScratch() {
  isScratching = false;
  ctx.beginPath();

  // Check if enough of the canvas is scratched
  if (isRevealed()) {
    invitation.classList.remove('hidden');
  }
}

// Scratch on canvas
function scratch(event) {
  if (!isScratching) return;

  const { x, y } = getPosition(event);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2, false);
  ctx.fill();
}

// Check if canvas is sufficiently scratched
function isRevealed() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparentPixels++; // Check alpha channel
  }

  const transparencyPercentage = (transparentPixels / (pixels.length / 4)) * 100;
  return transparencyPercentage > 75; // Reveal if 75% scratched
}

// Event listeners for mouse and touch
canvas.addEventListener('mousedown', startScratch);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', stopScratch);

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault(); // Prevent scrolling
  startScratch(event);
});

canvas.addEventListener('touchmove', (event) => {
  event.preventDefault(); // Prevent scrolling
  scratch(event);
});

canvas.addEventListener('touchend', (event) => {
  event.preventDefault(); // Prevent scrolling
  stopScratch();
});
