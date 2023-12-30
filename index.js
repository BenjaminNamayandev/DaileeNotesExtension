const mainCanvas = document.getElementById('drawingCanvas');
const mainContext = mainCanvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let eraserMode = false;

const canvasColorPicker = document.getElementById('canvasColorPicker');
const colorPicker = document.getElementById('colorPicker');
const penSizeInput = document.getElementById('penSize');
const eraserCheckbox = document.getElementById('eraserCheckbox');

const tempCanvas = document.createElement('canvas');
tempCanvas.width = mainCanvas.width;
tempCanvas.height = mainCanvas.height;
const tempContext = tempCanvas.getContext('2d');

mainCanvas.addEventListener('mousedown', startDrawing);
mainCanvas.addEventListener('mousemove', draw);
mainCanvas.addEventListener('mouseup', stopDrawing);
mainCanvas.addEventListener('mouseout', stopDrawing);

eraserCheckbox.addEventListener('change', toggleEraser);
canvasColorPicker.addEventListener('input', changeCanvasColor);

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.clientX - mainCanvas.offsetLeft, e.clientY - mainCanvas.offsetTop];
}

function draw(e) {
  if (!isDrawing) return;

  let [x, y] = [e.clientX - mainCanvas.offsetLeft, e.clientY - mainCanvas.offsetTop];

  mainContext.lineWidth = penSizeInput.value;

  if (eraserMode) {
    mainContext.strokeStyle = canvasColorPicker.value; 
  } else {
    mainContext.strokeStyle = colorPicker.value;
  }

  mainContext.beginPath();
  mainContext.moveTo(lastX, lastY);
  mainContext.lineTo(x, y);
  mainContext.stroke();

  tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempContext.drawImage(mainCanvas, 0, 0);

  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  mainContext.fillStyle = canvasColorPicker.value;
  mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function toggleEraser() {
  eraserMode = eraserCheckbox.checked;
}

function saveDrawing() {
  clearCanvas();
  mainContext.drawImage(tempCanvas, 0, 0);
  let dataUrl = mainCanvas.toDataURL('image/png');
  let link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'drawing.png';
  link.click();
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainContext.drawImage(tempCanvas, 0, 0);
}

function changeCanvasColor() {
  mainCanvas.style.background = canvasColorPicker.value;
}