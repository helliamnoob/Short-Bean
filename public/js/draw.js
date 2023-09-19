const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const colorBtns = document.querySelectorAll('.pallet button');
const eraserBtn = document.querySelector('#eraser');
const downloadBtn = document.querySelector('#download');
const clearCanvasBtn = document.querySelector('#clearCanvas');

canvas.width = 1200;
canvas.height = 700;

let isDrawing = false;
let isErasing = false;

ctx.lineWidth = 2;
ctx.strokeStyle = 'black';

function drawing(e) {
  if (!isDrawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  if (isErasing) {
    ctx.clearRect(x, y, 20, 20);
    socket.emit('drawing', { isErasing: true, x, y });
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit('drawing', { isErasing: false, x, y, color: ctx.strokeStyle });
  }
}

function startDrawing(e) {
  isDrawing = true;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(x, y);
  socket.emit('mousedown', { x, y, color: ctx.strokeStyle });
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
  socket.emit('mouseup');
}

function changeColor(e) {
  isErasing = false;
  const newColor = e.currentTarget.dataset.color;
  ctx.strokeStyle = newColor;

  colorBtns.forEach((button) => {
    if (button === e.currentTarget) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
  eraserBtn.classList.remove('selected');
}

function startErasing(e) {
  isErasing = true;
  colorBtns.forEach((button) => button.classList.remove('selected'));
  e.currentTarget.classList.add('selected');

  socket.emit('startErasing');
}

function downlodeCanvas() {
  const image = canvas.toDataURL('image/jpeg', 1.0);
  const linkEl = document.createElement('a');
  linkEl.href = image;
  linkEl.download = 'paintApp';
  linkEl.click();
}

function clearCanvas() {
  ctx.clearRect(0, 0, 2000, 700);
  colorBtns.forEach((button) => button.classList.remove("selected"));

  socket.emit('clearCanvas');
}

//소켓 코드

socket.on('drawing', (data) => {
  if (data.isErasing) {
    ctx.clearRect(data.x, data.y, 20, 20);
  } else {
    const currentStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = data.color;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.strokeStyle = currentStrokeStyle;
  }
});

socket.on('mousedown', (data) => {
  const currentStrokeStyle = ctx.strokeStyle;
  ctx.strokeStyle = data.color;
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
  ctx.strokeStyle = currentStrokeStyle;
});

socket.on('mouseup', () => {
  ctx.closePath();
});

socket.on('startErasing', () => {
  isErasing = true;
  colorBtns.forEach((button) => button.classList.remove('selected'));
  eraserBtn.classList.add('selected');
});

socket.on('stopErasing', () => {
  isErasing = false;
  eraserBtn.classList.remove('selected');
});

socket.on('clearCanvas', () => {
  ctx.clearRect(0, 0, 1000, 700);
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDrawing);
colorBtns.forEach((button) => button.addEventListener('click', changeColor));
eraserBtn.addEventListener('click', startErasing);
downloadBtn.addEventListener('click', downlodeCanvas);
clearCanvasBtn.addEventListener('click', clearCanvas);

//모바일 터치기능도 추가
function startDrawingTouch(e) {
  isDrawing = true;
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  ctx.beginPath();
  ctx.moveTo(x, y);
  socket.emit('mousedown', { x, y, color: ctx.strokeStyle });
}

function drawingTouch(e) {
  if (!isDrawing) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  if (isErasing) {
    ctx.clearRect(x, y, 20, 20);
    socket.emit('drawing', { isErasing: true, x, y });
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit('drawing', { isErasing: false, x, y, color: ctx.strokeStyle });
  }
}

function stopDrawingTouch() {
  isDrawing = false;
  ctx.closePath();
  socket.emit('mouseup');
}

// 터치 이벤트 리스너 등록
canvas.addEventListener('touchstart', startDrawingTouch);
canvas.addEventListener('touchmove', drawingTouch);
canvas.addEventListener('touchend', stopDrawingTouch);
