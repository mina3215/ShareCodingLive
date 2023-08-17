
import React, { useState, useCallback, useRef } from 'react';
import Tesseract from 'tesseract.js';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import VideoRoomComponent from './VideoRoomComponent';
import styled from 'styled-components';
// import TabContainer from '../chatting/chat/TabContainer';
import Socket from '../chatting/chat/Socket';
import { useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

const VideoRoomWrapper = styled.div`
  width: ${({ showChat, showMember }) => (showChat || showMember ? '75%' : '100%')};
  transition: width 0.3s ease-in-out;
`;

const TabContainerWrapper = styled.div`
  width: ${({ showChat, showMember }) => (showChat || showMember ? '25%' : '0%')};
  transition: width 0.3s ease-in-out;
`;

function MeetingPage(props) {

  const { pathname, state } = useLocation();
  const [configRef, setConfigRef] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [handUp, sethandUp] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [isExit, setIsExit] = useState(false);


  const divRef = useRef(null);

  const uuid = pathname.slice(9);
  const isHost = state ? state.isHost : false;

  const handleChildRef = (ref) => {
    setConfigRef(ref);
    // 이제 this.childRef를 사용하여 자식 컴포넌트의 ref를 조작할 수 있습니다.
  };

  const setCapture = () => {
    handleDownload();
  };

  const handleOcrResult = useCallback((result) => {
    setOcrResult(result);
  }, []);

  const handleDownload = async () => {
    console.log(configRef);
    if (!divRef.current) return;

    try {
      const div = configRef;
      const canvas = await html2canvas(div, { scale: 2 });

      // 캔버스를 dataURL로 변환
      const dataUrl = canvas.toDataURL();

      // 이미지 다운로드 트리거를 위한 임시 링크 생성
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'captured_image.png';
      document.body.appendChild(link);

      // 다운로드 트리거
      link.click();

      // DOM에서 임시 링크 삭제
      document.body.removeChild(link);

      // 캡쳐된 이미지 OCR 진행
      Tesseract.recognize(canvas, 'eng+kor')
        .catch((err) => {
          console.error('Error during OCR:', err);
        })
        .then(({ data: { text } }) => {
          // OCR 결과 txt 파일로 저장
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, 'ocr_result.txt');
        });
    } catch (error) {
      console.error('Error converting div to image:', error);
    }
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
    setShowMember(false);
    console.log(showChat, 'showChat');
    console.log(showChat, 'showMember');
  };

  const handleToggleMember = () => {
    setShowMember(!showMember);
    setShowChat(false);
    console.log(showMember, 'showMember');
    console.log(showMember, 'showChat');
  };

  const handleHandUp = () => {
    sethandUp((prevHandUp) => !prevHandUp);
  };

  return (
    <Wrapper>
      <VideoRoomWrapper showChat={showChat} showMember={showMember} ref={divRef}>
        <VideoRoomComponent
          uuid={uuid}
          isHost={isHost}
          handleToggleChat={handleToggleChat}
          handleToggleMember={handleToggleMember}
          handleHandUp={handleHandUp}
          handleChildRef={handleChildRef}
          setCapture={setCapture}
          setIsExit={setIsExit}
        />
      </VideoRoomWrapper>
      <TabContainerWrapper showChat={showChat} showMember={showMember}>
        <Socket uuid={uuid} showChat={showChat} showMember={showMember} handUp={handUp} isExit={isExit} isHost={isHost} />
      </TabContainerWrapper>
      {/* <button onClick={handleDownload}>다운로드</button> */}
    </Wrapper>
  );
}

export default MeetingPage;
