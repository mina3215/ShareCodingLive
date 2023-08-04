import React, { useEffect, useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Button } from '@material-ui/core';

// 컴포넌트
import Login from '../auth/login/Login';
import isAuthenticated from '../../common/api/isAuthenticated';
import Reservation from '../pages/Reservation';
import SignUp from '../auth/signup/SignUp';
import MainButton from '../pages/MainButton';
import Promotion from '../pages/Promotion';
import MyPage from '../pages/MyPage';
import UserInfo from '../pages/UserInfo';

// style
import { Container, Grid } from '@material-ui/core';
import styled from 'styled-components';
import captureIcon from '../../assets/captureIcon.png';

const CommonButton = styled(Button)`
  width: 90px;
  border-radius: 6px;
  margin: 1em 0em 0em 0em;
  padding: 0.4em 0em;
  background: ${(props) => (props.green ? '#94C798' : '#D9D9D9')};
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${(props) => (props.green ? '#7ec783' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

const FullScreenContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const PromotionContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  height: 80vh;
  align-items: center;
  // border: 2px solid black;
  background-color: white;
  border-radius: 10px;
  margin-left: 10%;
  margin-right: 5%;
`;

const AuthContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  // border: 2px solid black;
  border-radius: 10px;
  background-color: #484848;
  margin-left: 5%;
  margin-right: 10%;
`;

const AuthInnerContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  border-radius: 10px;
  background-color: white;
  margin: 10%;
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CustomImg = styled.img`
  width: 60px;
  height: 60px;
  margin-top: 10px;
`;

function Home() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [signupToggle, setSignupToggle] = useState(false);
  const [myPageToggle, setMyPageToggle] = useState(false);
  const [userInfoToggle, setUserInfoToggle] = useState(false);
  const [nickChanged, setnickChanged] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [progress, setProgress] = useState(0);
  const divRef = useRef(null);

  const handleOcrResult = useCallback((result) => {
    setOcrResult(result);
  }, []);

  const handleOcrProgress = (info) => {
    const { status, progress } = info;
    if (status === 'recognizing text') {
      // progress를 0 ~ 100 사이의 값으로 변환하여 업데이트합니다.
      setProgress(Math.floor(progress * 100));
    }
  };

  const handleDownload = async () => {
    if (!divRef.current) return;

    try {
      const div = divRef.current;
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
      Tesseract.recognize(canvas, 'eng+kor', {
        logger: (info) => handleOcrProgress(info),
      })
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

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    // console.log(authenticated, 'authenticated');
    // console.log(signupToggle, 'signupToggle');
    // console.log(myPageToggle, 'myPageToggle');
    // console.log(userInfoToggle, 'userInfoToggle');
  }, [authenticated, signupToggle, myPageToggle, userInfoToggle, nickChanged]);
  return (
    <Wrapper>
      <FullScreenContainer>
        <Grid container alignItems="center">
          <Grid item xs={6} container>
            <PromotionContainer ref={divRef}>
              {/* <CommonButton green="true" onClick={handleDownload}>
                {<CustomImg src={captureIcon} alt="captureIcon" />}
              </CommonButton>
              <ProgressBar variant="success" label={`${progress}%`} now={progress}></ProgressBar> */}
              {authenticated && (
                <MainButton ChangeLogout={setAuthenticated} ToMyPage={setMyPageToggle} ToUserInfo={setUserInfoToggle} />
              )}
              {!authenticated && <Promotion />}
            </PromotionContainer>
          </Grid>
          <Grid item xs={6} container alignItems="center">
            <AuthContainer>
              <AuthInnerContainer>
                {!authenticated && !signupToggle && (
                  <Login
                    ChangeLogin={setAuthenticated}
                    ChangeSignUp={setSignupToggle}
                    ToMyPage={setMyPageToggle}
                    ToUserInfo={setUserInfoToggle}
                  />
                )}
                {authenticated && !signupToggle && !myPageToggle && !userInfoToggle && <Reservation />}
                {signupToggle && <SignUp ToLogin={setSignupToggle} />}
                {authenticated && myPageToggle && !userInfoToggle && (
                  <MyPage ToMyPage={setMyPageToggle} ToUserInfo={setUserInfoToggle} />
                )}
                {authenticated && userInfoToggle && (
                  <UserInfo
                    hangeLogout={setAuthenticated}
                    ToUserInfo={setUserInfoToggle}
                    nickTouched={setnickChanged}
                  />
                )}
              </AuthInnerContainer>
            </AuthContainer>
          </Grid>
        </Grid>
      </FullScreenContainer>
    </Wrapper>
  );
}

export default Home;
