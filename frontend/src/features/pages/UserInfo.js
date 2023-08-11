import { checkUserInfo } from '../auth/authSlice';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// 스타일
import { toast } from 'react-toastify';
import { Container, Button } from '@material-ui/core';
import styled from 'styled-components';
import { getToken } from '../../common/api/JWT-common';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// 컴포넌트
import ModifyUserNickName from '../auth/modify/ModifyUserNickname';
import ModifyPassword from '../auth/modify/ModifyPassword';

// style
const Wrapper = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const UserContainer = styled.div`
  margin-top: 5vh;
  height: 50vh;
  display: flex;
  width: 25vw;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`;

const NicknameContainer = styled(Container)`
  background-color: #ffff;
  border: 3px solid #2d2f42;
  border-bottom: none;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px 10px 0px 0px;
  padding: 10px 20px 0px 20px;
`;

const EmailContainer = styled(Container)`
  background-color: #ffff;
  border: 3px solid #2d2f42;
  border-top: none;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 0px 0px 10px 10px;
  padding: 10px 20px 10px 20px;
`;

const IconContainer = styled.div`
	margin-top: 5px;
  margin-right: 10px;
`;

const TextTitle = styled.label`
  font-size: 30px;
  color: #262626;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-top: 4vh;
`;
const TextLabel = styled.label`
  font-size: 15px;
  color: #262626;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-bottom: 10px;
`;

const TextSubtitle = styled.label`
  font-size: 20px;
  color: #262626;
  padding: 10px 0 10px 10px;
  display: block;
  text-align: center;
`;

const NickButton = styled(Button)`
  width: 10%;
  border-radius: 6px;
  // margin: 1em 0em 0em 0em;
  padding: 0.4em 1em;
	background: linear-gradient(
    to bottom,
    ${(props) => (props.green ? '#3C6EBF' : '#D9D9D9')},
    ${(props) => (props.green ? '#3F3998' : '#D9D9D9')}
  );
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  display: block;
  margin-left: auto;
  &:hover {
    background: ${(props) => (props.green ? '#9a95ee' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;
// const PassButton = styled(Button)`
//   width: 50%;
//   border-radius: 6px;
//   margin: 1em 0em 0em 0em;
//   padding: 0.4em 1em;
//   background: ${(props) => (props.green ? '#94C798' : '#D9D9D9')};
//   color: ${(props) => (props.grey ? '#262626' : 'white')};
//   display: block;
//   margin-left: auto;
//   margin-right: auto;
//   &:hover {
//     background: ${(props) => (props.green ? '#7ec783' : '#a1a1a1')};
//     color: ${(props) => (props.grey ? 'white' : '#262626')};
//   }

//   &:disabled {
//     opacity: 0.35;
//     color: ${(props) => (props.grey ? 'white' : 'black')};
//   }
// `;

const UserInfo = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const [userEmail, setUserEmail] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [nickEdit, setNickEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);

  const nickEditHandler = () => {
    setNickEdit(true);
    setPasswordEdit(false);
  };
  const passwordEditHandler = () => {
    setNickEdit(false);
    setPasswordEdit(true);
  };

  useEffect(() => {}, [nickEdit, passwordEdit, userNickName]);

  useEffect(() => {
    const data = {
      token,
    };
    dispatch(checkUserInfo(data))
      .unwrap()
      .then((res) => {
        // console.log(res.data.data);
        const email = res.data.data.email;
        const nickname = res.data.data.nickname;
        setUserEmail(email);
        setUserNickName(nickname);
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error('비밀번호를 다시 입력해주세요');
        } else if (err.status === 401) {
          toast.error('다시 로그인해주세요');
          props.hangeLogout(true);
          props.ToUserInfo(false);
        } else if (err.status === 404) {
          toast.error('다시 로그인해주세요');
          props.hangeLogout(true);
          props.ToUserInfo(false);
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }, [userNickName]);

  return (
    <Wrapper>
      <TextTitle>회원정보</TextTitle>
      <UserContainer>
        <TextLabel htmlFor="info">기본정보</TextLabel>
        <NicknameContainer id="info">
          <IconContainer>
            <AccountCircleIcon color="active" />
          </IconContainer>
          <div>
            <TextSubtitle>{userNickName}</TextSubtitle>
          </div>
          <NickButton green="true" onClick={nickEditHandler}>
            수정
          </NickButton>
        </NicknameContainer>
        <EmailContainer id="info">
          <IconContainer>
            <AlternateEmailIcon color="active" />
          </IconContainer>
          <div>
            <TextSubtitle>{userEmail}</TextSubtitle>
          </div>
        </EmailContainer>

        <br />

        {/* {!nickEdit && !passwordEdit && (
          <PassButton green="true" onClick={passwordEditHandler}>
            비밀번호 수정
          </PassButton>
        )} */}
        {nickEdit && (
          <ModifyUserNickName
            ToUserInfo={props.ToUserInfo}
            ToMyPage={props.ToMyPage}
            modNick={setNickEdit}
            nickTouch={props.nickTouched}
          />
        )}
        {!nickEdit && (
          <ModifyPassword
            ToUserInfo={props.ToUserInfo}
            ToMyPage={props.ToMyPage}
            ChangeLogin={props.ChangeLogin}
            modPassword={setPasswordEdit}
          />
        )}
      </UserContainer>
    </Wrapper>
  );
};
export default UserInfo;
