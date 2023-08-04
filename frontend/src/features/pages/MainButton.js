import { useState } from 'react';

// 컴포넌트
import { logout } from '../../features/auth/authSlice';
import { deleteToken } from '../../common/api/JWT-common';
import ModalBasic from '../../common/UI/ModalBasic';

// 스타일
import styled from 'styled-components';
import { Button, Container } from '@material-ui/core';
import newConf from '../../assets/newConf.png';
import enterConf from '../../assets/enterConf.png';
import myPage from '../../assets/myPage.png';
import logouticon from '../../assets/logouticon.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const CommonButton = styled(Button)`
  width: 100px;
  height: 100px;
  margin-top: 30px;
  margin-bottom: 10px;
  border-radius: 20px;
  background: ${(props) => {
    if (props.green) {
      return '#3B7DDD';
    } else if (props.black) {
      return '#282828';
    } else if (props.darkgrey) {
      return '#484848';
    } else if (props.grey) {
      return '#d9d9d9';
    }
  }};
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  &:hover {
    background: ${(props) => (props.green ? '#418eff' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;
const CustomButtomDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CustomImg = styled.img`
  width: 60px;
  height: 60px;
  margin: auto;
`;

const CustomPromotionContainer = styled(Container)`
  display: flex;
  justify-content: space-evenly;
  height: 80vh;
  align-items: center;
  // border: 2px solid black;
  background-color: white;
  // margin-right: 5%;
`;

const MainButton = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newConference, setNewConference] = useState(false);
  const [enterConference, setEnterConference] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showCreateModal = () => {
    setModalOpen(true);
    setNewConference(true);
  };

  const showEnterModal = () => {
    setModalOpen(true);
    setEnterConference(true);
  };

  const openMyPage = () => {
    props.ToMyPage(true);
    props.ToUserInfo(false);
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        deleteToken();
        props.ChangeLogout(deleteToken());
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error('다시 시도해주세요');
        } else if (err.status === 404) {
          deleteToken();
          props.ChangeLogout(deleteToken());
        } else if (err.status === 401) {
          deleteToken();
          props.ChangeLogout(deleteToken());
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  };

  return (
    <CustomPromotionContainer>
      <CustomButtomDiv>
        <CommonButton id="newConference" onClick={showCreateModal} black="true">
          <CustomImg src={newConf} alt="newConf" />
        </CommonButton>
        <label htmlFor="newConference">새 회의</label>
        <CommonButton id="myPage" onClick={openMyPage} darkgrey="true">
          <CustomImg src={myPage} alt="myPage" />
        </CommonButton>
        <label htmlFor="myPage">마이페이지</label>
      </CustomButtomDiv>
      <CustomButtomDiv>
        <CommonButton id="enterConference" onClick={showEnterModal} green="true">
          <CustomImg src={enterConf} alt="enterConf" />
        </CommonButton>
        <label htmlFor="enterConference">회의 참가</label>
        <CommonButton id="logout" onClick={handleLogout} grey="true">
          <CustomImg src={logouticon} alt="logouticon" />
        </CommonButton>
        <label htmlFor="logout">로그아웃</label>
      </CustomButtomDiv>
      {modalOpen && (
        <ModalBasic
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
          newConference={newConference}
          enterConference={enterConference}
          setNewConference={setNewConference}
          setEnterConference={setEnterConference}
        />
      )}
    </CustomPromotionContainer>
  );
};
export default MainButton;
