import React, { useEffect, useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';

// 컴포넌트
import Login from '../auth/login/Login';
import isAuthenticated from '../../common/api/isAuthenticated';
import Reservation from '../pages/Reservation';
import SignUp from '../auth/signup/SignUp';
import MainButton from '../pages/MainButton';
import Promotion from '../pages/Promotion';
import MyPage from '../pages/MyPage';
import UserInfo from '../pages/UserInfo';
import ConferenceHistory from '../pages/ConferenceHistory';
import LeftConference from '../pages/LeftConference';

// style
import { Container, Grid } from '@material-ui/core';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FullScreenContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const PromotionContainer = styled(Container)`
  display: flex;
  justify-content: center;
  height: 80vh;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  margin-left: 0;
  margin-right: 5%;
`;

const AuthContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  border-radius: 10px;
  background-color: #ffff;
  margin-left: 5%;
  margin-right: 0;
`;

const AuthInnerContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80%;
  border-radius: 10px;
  border: 3px solid #2d2f42;
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

function Home() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [signupToggle, setSignupToggle] = useState(false);
  const [myPageToggle, setMyPageToggle] = useState(false);
  const [userInfoToggle, setUserInfoToggle] = useState(false);
  const [historyToggle, setHistoryToggle] = useState(false);
  const [nickChanged, setnickChanged] = useState(false);
  const [ocrResult, setOcrResult] = useState('');

  const divRef = useRef(null);

  const handleOcrResult = useCallback((result) => {
    setOcrResult(result);
  }, []);

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

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    // console.log(authenticated, 'authenticated');
    // console.log(signupToggle, 'signupToggle');
    // console.log(myPageToggle, 'myPageToggle');
    // console.log(userInfoToggle, 'userInfoToggle');
  }, [authenticated, signupToggle, myPageToggle, userInfoToggle, nickChanged, historyToggle]);
  return (
    <Wrapper>
      <FullScreenContainer>
        <Grid container alignItems="center">
          <Grid item xs={6} container>
            <PromotionContainer ref={divRef}>
              {authenticated && !historyToggle && (
                <MainButton
                  ChangeLogout={setAuthenticated}
                  ToMyPage={setMyPageToggle}
                  ToUserInfo={setUserInfoToggle}
                  ToHistory={setHistoryToggle}
                />
              )}
              {/* 예약 왼쪽 */}
              {authenticated && !userInfoToggle && historyToggle && !myPageToggle && !signupToggle && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    marginTop: '8%',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ArrowBackIcon
                      style={{ cursor: 'pointer', color: '#4B4F82' }}
                      onClick={() => {
                        setMyPageToggle(!myPageToggle);
                        setHistoryToggle(!historyToggle);
                      }}
                    />
                    <HomeIcon
                      style={{ cursor: 'pointer', color: '#4B4F82' }}
                      onClick={() => {
                        setHistoryToggle(!historyToggle);
                      }}
                    />
                  </div>
                  <LeftConference />
                  <div style={{ height: '5%' }}></div>
                </div>
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
                {authenticated && !signupToggle && !myPageToggle && !userInfoToggle && !historyToggle && (
                  <Reservation />
                )}
                {signupToggle && <SignUp ToLogin={setSignupToggle} />}
                {authenticated && myPageToggle && !userInfoToggle && !historyToggle && (
                  <MyPage ToMyPage={setMyPageToggle} ToUserInfo={setUserInfoToggle} ToHistory={setHistoryToggle} />
                )}
                {authenticated && userInfoToggle && (
                  <UserInfo
                    hangeLogout={setAuthenticated}
                    ToUserInfo={setUserInfoToggle}
                    nickTouched={setnickChanged}
                    ToMyPage={setMyPageToggle}
                    ChangeLogin={setAuthenticated}
                  />
                )}
                {authenticated && !userInfoToggle && historyToggle && !myPageToggle && !signupToggle && (
                  <ConferenceHistory />
                )}
              </AuthInnerContainer>
            </AuthContainer>
          </Grid>
        </Grid>
        {/* <button onClick={handleDownload}>다운로드</button> */}
      </FullScreenContainer>
    </Wrapper>
  );
}

export default Home;
