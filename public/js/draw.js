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
canvas.addEventListener('mouseup', onMouseUp);

function emitDrawingData(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  const isDrawing = isPainting;
  socket.emit('draw', { x, y, isDrawing }, roomId);
}

// 서버로부터 그림 그리기 이벤트를 받음
socket.on('draw', (data) => {
  const { x, y, isDrawing } = data;
  if (isDrawing) {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.moveTo(x, y);
  }
});

// 이벤트 리스너에 소켓 이벤트를 전송하는 함수 추가
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousemove', emitDrawingData); // 추가된 코드
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
