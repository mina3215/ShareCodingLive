import React, { useState, useRef, useEffect } from 'react';
import Member from './Member';
import HandMember from './HandMember';

const Members = (props) => {

  const messages = props.messages

  
  // 모든 참가자
  const [members, setMembers] = useState([]);
  // setMembers를 하기 위한 변수. props 받은 참가자 담을 변수 
  let participants = []

  
  // 손 든 참가자
  const [handmembers, setHandMembers] = useState([]);
  // setHandMember를 하기 위한 변수. 손 든 참가자 넣었다 뺐다 할 변수 
  let handparticipants = []



  // 메시지 타입에 따라 작업을 수행합니다.
  const processMessages = () => {
    messages.forEach(message => {
      if (message.type === 'ENTER') {
        console.log('enter : ', message)
        // ENTER 타입 메시지는 멤버 배열에 추가합니다.
        console.log("participants: ", message.participants)
        participants = message.participants
        setMembers(participants);

      } else if (message.type === 'QUIT') {
        // QUIT 타입 메시지의 발신자를 멤버 배열에서 제외합니다.
        setMembers(prevMembers => prevMembers.filter(member => member !== message.sender));

      } else if (message.type === 'HAND_UP') {
        // 손 든 참가자는 handparticipants에 다 넣어버림
        handparticipants.push(message.sender)
        setHandMembers(handparticipants);

        // 모든 참가자들은 participants에서 handparticipants에 포함 안되는 애들 전부

        participants = participants.filter(member => !handparticipants.includes(member));
        participants.sort()
        console.log('newparticipants: ', participants)
        setMembers(participants);

      } else if (message.type === 'HAND_DOWN') {
        // handparticipants에서 손 내린 참가자 제외해서 setHandMember 하기.
        handparticipants = handparticipants.filter(person => person !== message.sender);
        setHandMembers(handparticipants);
        

        // 손 내린 참가자는 다시 Member에 넣어줘야됨.
        // 그렇게 하기 위해서 기존의 participants 배열에 push 해주고 setMembers 하기
        participants.push(message.sender)
        participants.sort()
        console.log('handdown participants: ', participants)
        setMembers(participants);
        
      }
    });
  };

  // 컴포넌트가 렌더링될 때 작업을 수행합니다.
  useEffect(() => {
    processMessages();
  }, [messages]);
    
 
  return (
    <div>
      <HandMember handmembers={handmembers} />
      <Member members={members} />
      
    </div>
  )
}

export default Members