const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const invitation = document.getElementById("invitation");

// Initialize the canvas
canvas.width = 300;
canvas.height = 200;
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Scratch effect
let isScratching = false;

function handleScratch(e) {
  if (!isScratching) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.fill();
}

function startScratch() {
  isScratching = true;
}

function stopScratch() {
  isScratching = false;

  // Check if enough area is scratched
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const clearPixels = pixels.data.filter((value, index) => index % 4 === 3 && value === 0).length;

  if (clearPixels > pixels.data.length * 0.7) {
    canvas.style.display = "none"; // Hide the canvas
    invitation.classList.remove("hidden"); // Reveal invitation
  }
}

canvas.addEventListener("mousedown", startScratch);
canvas.addEventListener("mouseup", stopScratch);
canvas.addEventListener("mousemove", handleScratch);
canvas.addEventListener("mouseleave", stopScratch);
