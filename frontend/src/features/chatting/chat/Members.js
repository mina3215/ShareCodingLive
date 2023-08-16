import React, { useState, useRef, useEffect } from 'react';
import Member from './Member';
import HandMember from './HandMember';
import styled from 'styled-components';

const TabContainerWrapper = styled.div`
  position: relative;
  z-index: 9999;
  width: 25vw;
  height: 100vh; /* Set a specific height for the chat container */
  margin: 0 auto;
  padding: 20px;
  border: none;
  background: linear-gradient(to bottom, #313131, #282828);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Enable vertical scrolling when content overflows */
`;

const Title = styled.div`
  color: #d9d9d9;
  font-size: 23px;
  font-weight: bold;
  padding-bottom: 10px;
  padding-left: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid white;
`;

const Members = (props) => {
  // const messages = props.messages

  const messages = props.messages;

  // 모든 참가자
  const [members, setMembers] = useState([]);
  // setMembers를 하기 위한 변수. props 받은 참가자 담을 변수
  let participants = [];

  // 손 든 참가자
  const [handmembers, setHandMembers] = useState([]);
  // setHandMember를 하기 위한 변수. 손 든 참가자 넣었다 뺐다 할 변수
  let handparticipants = [];

  // 메시지 타입에 따라 작업을 수행합니다.
  const processMessages = () => {
    messages.forEach((message) => {
      if (message.type === 'ENTER') {
        console.log('enter : ', message);
        // ENTER 타입 메시지는 멤버 배열에 추가합니다.
        console.log('participants: ', message.participants);
        participants = message.participants;
        setMembers(participants);
      } else if (message.type === 'QUIT') {
        // QUIT 타입 메시지의 발신자를 멤버 배열에서 제외합니다.
        setMembers((prevMembers) => prevMembers.filter((member) => member !== message.sender));
      } else if (message.type === 'HAND_UP') {
        // 손 든 참가자는 handparticipants에 다 넣어버림
        handparticipants.push(message.sender);
        setHandMembers(handparticipants);

        // 모든 참가자들은 participants에서 handparticipants에 포함 안되는 애들 전부

        participants = participants.filter((member) => !handparticipants.includes(member));
        participants.sort();
        console.log('newparticipants: ', participants);
        setMembers(participants);
      } else if (message.type === 'HAND_DOWN') {
        // handparticipants에서 손 내린 참가자 제외해서 setHandMember 하기.
        handparticipants = handparticipants.filter((person) => person !== message.sender);
        setHandMembers(handparticipants);

        // 손 내린 참가자는 다시 Member에 넣어줘야됨.
        // 그렇게 하기 위해서 기존의 participants 배열에 push 해주고 setMembers 하기
        participants.push(message.sender);
        participants.sort();
        console.log('handdown participants: ', participants);
        setMembers(participants);
      }
    });
  };

  // 컴포넌트가 렌더링될 때 작업을 수행합니다.
  useEffect(() => {
    processMessages();
  }, [messages]);

  // const messages = [props.messages]

  // const [members, setMembers] = useState([
  //   '박단비', '김민수', '박민아', '김유정', '정재욱', '진희솜',
  // ]);

  // const deleteMember = () => {

  //   setMembers(members.filter(member => member !== '박단비'))
  // }

  // // // 채팅 받기
  // const recvMessage = (recv) => {
  //   // 참가자 받는 함수
  //   if (recv.type === 'ENTER') {
  //     setMembers((prevMerbers) => [
  //       ...prevMerbers,
  //       { sender: recv.sender, members: recv.message},

  //     ]);
  //   }
  //   // 나간 참가자 삭제하기 위한
  //   else if (recv.type === 'QUIT') {
  //     setMembers(members.filter(member => member !== recv.sender))

  //   }
  //   // 일반 채팅일 경우
  //   else if (recv.type === 'TALK') {
  //     setChats((prevChats) => [
  //       ...prevChats,
  //       { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},

  //     ]);

  //   }
  //   // 질문일 경우
  //   else if (recv.type === 'QUESTION') {
  //     setQuestions((prevQuestions) => [
  //       ...prevQuestions,
  //       { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},

  //     ]);

  //   }
  //   // 코드일 경우
  //   else if (recv.type === 'CODE') {
  //     setCodes((prevCodes) => [
  //       ...prevCodes,
  //       { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime , title: recv.title, summarization: recv.summarization},

  //     ]);

  //   }

  // };

  return (
    <TabContainerWrapper>
      <Title>참가자 목록</Title>
      <HandMember handmembers={handmembers} />
      <Member members={members} />
    </TabContainerWrapper>
    //   <div>
    //     {/* {console.log("ma: ",members)}
    //     {console.log("m: ",members[0])}
    //     {(members[0]).map((mem, idx) => {
    //       return <div>
    //         <h3>{mem}</h3>
    //       </div>
    //     })} */}
    //   </div>
  );
};

export default Members;
