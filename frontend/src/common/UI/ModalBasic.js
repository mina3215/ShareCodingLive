import { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import NewConference from '../../features/pages/Newconference';
import EnterConference from '../../features/pages/EnterConference';

const ModalContainer = styled.div`
  width: 600px;
  height: 400px;
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  font-size: 30px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.green ? '#3C6EBF' : '#D9D9D9')},
    ${(props) => (props.green ? '#3F3998' : '#D9D9D9')}
  );
  color: white;

  &:hover {
    background-color: #888888;
    color: #242424;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
  background-color: rgba(5, 5, 5, 0.5);
  backdrop-filter: blur(6px);
`;

function ModalBasic(props) {
  // 모달 끄기
  const closeModal = () => {
    props.setModalOpen(false);
    props.setNewConference(false);
    props.setEnterConference(false);
  };
  const modalRef = useRef(null);

  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        props.setModalOpen(false);
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener('mousedown', handler);

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener('mousedown', handler);
    };
  });

  return (
    <Fragment>
      {props.modalOpen && <Overlay />}
      <ModalContainer ref={modalRef}>
        <CloseButton onClick={closeModal}>X</CloseButton>
        {props.newConference && !props.enterConference && <NewConference />}
        {props.enterConference && !props.newConference && <EnterConference />}
      </ModalContainer>
    </Fragment>
  );
}
export default ModalBasic;

