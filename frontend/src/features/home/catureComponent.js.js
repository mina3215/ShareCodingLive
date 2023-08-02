import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const CaptureComponent = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureArea, setCaptureArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const captureAreaRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsCapturing(true);
    setCaptureArea({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (isCapturing) {
      const width = e.clientX - captureArea.x;
      const height = e.clientY - captureArea.y;
      setCaptureArea((prev) => ({ ...prev, width, height }));
    }
  };

  const handleMouseUp = () => {
    setIsCapturing(false);
  };

  const handleCapture = () => {
    if (captureAreaRef.current) {
      // Introduce a small delay before capturing the area
      setTimeout(() => {
        html2canvas(captureAreaRef.current, { ...captureArea, scale: 1 })
          .then((canvas) => {
            const dataURL = canvas.toDataURL();
            const link = document.createElement('a');
            link.download = 'capture.png';
            link.href = dataURL;
            link.click();
          })
          .catch((error) => {
            console.error('Error capturing the area:', error);
          });
      }, 100);
    }
  };

  return (
    <div>
      <button onClick={handleCapture}>Capture</button>
      <div
        ref={captureAreaRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          border: '2px dashed red',
          width: '100vw', // 화면 전체 너비 설정
          height: '100vh', // 화면 전체 높이 설정
          cursor: isCapturing ? 'crosshair' : 'auto',
        }}
      >
        {/* 캡쳐하고자 하는 영역 */}
        {isCapturing && (
          <div
            style={{
              position: 'absolute',
              left: captureArea.x,
              top: captureArea.y,
              width: captureArea.width,
              height: captureArea.height,
              border: '2px solid red',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CaptureComponent;
