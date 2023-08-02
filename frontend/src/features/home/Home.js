import React, { useEffect, useState } from 'react';

// 컴포넌트
import Login from '../auth/login/Login';
import isAuthenticated from '../../common/api/isAuthenticated';
import Reservation from '../pages/Reservation';
import SignUp from '../auth/signup/SignUp';
import MainButton from '../pages/MainButton';
import Promotion from '../pages/Promotion';
import MyPage from '../pages/MyPage';
import UserInfo from '../pages/UserInfo';
import Ocr from '../ocr/ocr';
import CaptureComponent from './catureComponent.js';

// style
import { Container, Grid } from '@material-ui/core';
import styled from 'styled-components';

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

function Home() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [signupToggle, setSignupToggle] = useState(false);
  const [myPageToggle, setMyPageToggle] = useState(false);
  const [userInfoToggle, setUserInfoToggle] = useState(false);
  const [nickChanged, setnickChanged] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    // console.log(authenticated, 'authenticated');
    // console.log(signupToggle, 'signupToggle');
    // console.log(myPageToggle, 'myPageToggle');
    // console.log(userInfoToggle, 'userInfoToggle');
  }, [authenticated, signupToggle, myPageToggle, userInfoToggle, nickChanged]);
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <CaptureComponent />
      </div>
      <Wrapper>
        <FullScreenContainer>
          <Grid container alignItems="center">
            <Grid item xs={6} container>
              <PromotionContainer>
                {authenticated && (
                  <MainButton
                    ChangeLogout={setAuthenticated}
                    ToMyPage={setMyPageToggle}
                    ToUserInfo={setUserInfoToggle}
                  />
                )}
                {!authenticated && <Ocr />}
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
    </div>
  );
}

export default Home;
