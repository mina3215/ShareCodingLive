import Tesseract from 'tesseract.js';
import { useState, useCallback } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function Ocr() {
  const [log, setLog] = useState({ status: 'default', progress: 0 });
  const [imagePath, setImagePath] = useState('');
  const [result, setResult] = useState('');

  const exportTxt = useCallback(() => {
    let fileName = '파일이름.txt';
    const element = document.createElement('a');
    const file = new Blob([result], {
      // Use the OCR result stored in the 'result' state
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // FireFox
    element.click();
  }, [result]); // Add 'result' as a dependency for useCallback

  const handleChange = (event) => {
    const tempImagePath = URL.createObjectURL(event.target.files[0]);

    setImagePath(tempImagePath);

    Tesseract.recognize(tempImagePath, 'eng+kor', {
      logger: (m) => {
        setLog({
          status: m.status,
          progress: Math.floor(m.progress.toFixed(2) * 100),
        });
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then(({ data: { text } }) => {
        setResult(text);
      });
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>이미지 업로드</h3>
        <img src={imagePath} className="upload_img" alt="upload_img" />
        <input type="file" onChange={handleChange} />
        <h3>인식 결과</h3>
        {'분류중 >>'} <ProgressBar label={`${log.progress}%`} now={log.progress}></ProgressBar>
        <div className="text-box">
          <p>result: {result}</p>
        </div>
        <button onClick={exportTxt}>export</button>
      </main>
    </div>
  );
}

export default Ocr;
