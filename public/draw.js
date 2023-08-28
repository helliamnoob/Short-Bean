import { fabric } from 'fabric';

document.addEventListener("DOMContentLoaded", function() {
    // 캔버스 초기화
    const canvas = new fabric.Canvas('drawingCanvas');
    
    // 그리기 모드 활성화
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "#000000";

    // 추가적인 기능(예: 객체 추가, 수정 등)도 여기에 구현할 수 있습니다.
});
