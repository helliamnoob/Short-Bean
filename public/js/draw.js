const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 700;

ctx.lineWidth = 2;
let isPainting = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}
function onMouseDown() {
  isPainting = true;
}
function onMouseUp() {
  isPainting = false;
}
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', emitDrawingData);
canvas.addEventListener('mouseup', onMouseUp);

function emitDrawingData(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  const isDrawing = isPainting;
  socket.emit('draw', { x, y, isDrawing }, roomId);
}


//모바일 터치기능도 추가
function onTouchMove(event) {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.offsetLeft;
  const y = touch.clientY - canvas.offsetTop;
  if (isPainting) {
    ctx.lineTo(x, y);
    ctx.stroke();
    return;
  }
  ctx.moveTo(x, y);
}

function onTouchStart() {
  isPainting = true;
}

function onTouchEnd() {
  isPainting = false;
}

function emitTouchDrawingData(event) {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.offsetLeft;
  const y = touch.clientY - canvas.offsetTop;
  const isDrawing = isPainting;
  socket.emit('draw', { x, y, isDrawing }, roomId);
}

canvas.addEventListener('touchmove', onTouchMove);
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchmove', emitTouchDrawingData);

socket.on('draw', (data) => {
  const { x, y, isDrawing } = data;
  if (isDrawing) {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.moveTo(x, y);
  }
});

//지우기 기능 구현
const clearBtn = document.getElementById('clear');

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clear', roomId); 
}

clearBtn.addEventListener('click', clearCanvas);

socket.on('clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});