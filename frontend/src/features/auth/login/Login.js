import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Button, makeStyles } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteToken } from '../../../common/api/JWT-common';
import { login } from '../authSlice';
// import logo from '../../../assets/logo.png';
import { saveToken } from '../../../common/api/JWT-common';
import { saveNickname } from '../../../common/api/JWT-common';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// import axios from 'axios'

import axios from '../../../common/api/http-common';

// import { getToken } as tokenget from '../../common/api/JWT-common';/

// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// import axios from 'axios'

// import axios from '../../../common/api/http-common';

// import { getToken } as tokenget from '../../common/api/JWT-common';/

const Wrapper = styled(Container)`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TextTitle = styled.label`
  font-size: 30px;
  color: #262626;
  font-weight: bold;
  display: block;
  text-align: center;
`;

const TextSubtitle = styled.label`
  font-size: 15px;
  color: #262626;
  padding: 1.5em 0;
  display: block;
  text-align: center;
`;

export const CommonTextValidator = styled(TextValidator)`
  opacity: 0.8;
  width: 100%;
  height: 50px;
  font-size: 10px;
  font-color: #262626;
  padding: 1em 0 1em 0;
  border: red;

  // & label {
  //   color: black;
  //   font-weight: bold;
  // }

  & .MuiOutlinedInput-input {
    // border-radius: 6px;
    background-color: #ffffff;
    // padding: 0.6em;
    // border: 1px solid #dddddd;
  }

  // & .MuiOutlinedInput-notchedOutline {
  //   opacity: 0;
  // }
  margin-bottom: ${(props) => (props.islogininput ? '15px' : '0')};
`;

// 클래스 스타일
const useStyles = makeStyles({
  validatorForm: {
    width: '90%',
  },
  button: {
    background: 'linear-gradient(45deg, #ff859f 30%, #ffa87a 70%)',
    borderRadius: 7,
    border: 0,
    fontWeight: 'bold',
    color: 'white',
    height: 40,
    marginTop: '10px',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 70%)',
    },
  },
});

export const CommonButton = styled(Button)`
  width: 50%;
  border-radius: 6px;
  margin: 1em 0em 0em 0em;
  padding: 0.4em 1em;
  // background: linear-gradient(to bottom, #2d2f42, #4c5085);
  background: linear-gradient(
    to bottom,
    ${(props) => (props.green ? '#3C6EBF' : '#D9D9D9')},
    ${(props) => (props.green ? '#3F3998' : '#D9D9D9')}
  );
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${(props) => (props.green ? '#9a95ee' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

// 로그인 컴포넌트
export default function Login(props) {
  // 알림 받기 위한 변수들
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: 'share-coding-live.firebaseapp.com',
    projectId: 'share-coding-live',
    storageBucket: 'share-coding-live.appspot.com',
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };

  // 이거도 알람
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그인 폼 필드 값 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 회원가입 버튼 클릭 시 이벤트 처리
  const signUpHandler = () => {
    props.ChangeSignUp(true);
    props.ToMyPage(false);
  };

  // 로그인 폼 제출 시 이벤트 처리
  // 알람 보내는 로직 추가됨
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    dispatch(login(data))
      .unwrap()
      .then(async (response) => {
        const token = response.headers['access-token'];
        const nickname = response.data.nickname;
        console.log(response.data.nickname, 'login_response');
        // console.log(response.headers, 'Login response headers');
        if (token !== undefined) {
          saveToken(token);
          if (nickname !== undefined) {
            saveNickname(nickname);
          }
        }
        props.ChangeLogin(token);
        props.ChangeSignUp(false);
        props.ToUserInfo(false);

        console.log('권한 요청 중...');

        const permission = await Notification.requestPermission();
        if (permission === 'denied') {
          console.log('알림 권한 허용 안됨');
          return;
        }

        console.log('알림 권한이 허용됨');

        const FCM_Token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });

        if (FCM_Token) console.log('token: ', FCM_Token);
        else console.log('Can not get Token');

        onMessage(messaging, (payload) => {
          console.log('메시지가 도착했습니다.', payload);
          // ...
        });

        axios({
          method: 'post',
          url: '/reservation/token',
          // data:{FCM_ACCESS_TOKEN:FCM_Token},
          data: { fcm_ACCESS_TOKEN: FCM_Token },
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          console.log(response);
        });
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error('입력하신 정보를 확인해주세요');
        } else if (err.status === 409) {
          toast.error('이미 로그인된 사용자입니다');
        } else if (err.status === 401) {
          toast.error('아이디와 비밀번호를 다시 확인해주세요');
          deleteToken();
          props.ChangeLogin(null);
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }

  // render
  return (
    <Wrapper>
      {/* <LogoWrapper>
        <Logo to="/" src={logo} />
      </LogoWrapper> */}

      <LoginContainer>
        <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
          <TextTitle>LOGIN</TextTitle>
          <TextSubtitle>쉐코라 시작하기</TextSubtitle>
          {/* 이메일 입력 필드 */}
          <CommonTextValidator
            islogininput="true"
            size="small"
            type="email"
            label="Email"
            // color="primary"
            onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
            name="email"
            value={email}
            validators={['required', 'isEmail']}
            errorMessages={['정보를 입력해주세요', '이메일 형식으로 입력해주세요']}
            variant="outlined"
            margin="normal"
          />
          {/* 비밀번호 입력 필드 */}
          <CommonTextValidator
            size="small"
            label="비밀번호"
            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
            value={password}
            name="password"
            type="password"
            validators={['required']}
            errorMessages={['정보를 입력해주세요']}
            variant="outlined"
            margin="normal"
          />
          <CommonButton green="true" type="submit">
            로그인
          </CommonButton>
          <br />
          <CommonButton onClick={signUpHandler} grey="true">
            회원가입
          </CommonButton>
        </ValidatorForm>
      </LoginContainer>
    </Wrapper>
  );
}
