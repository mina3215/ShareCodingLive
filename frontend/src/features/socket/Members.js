import React, { useState, useRef, useEffect } from 'react';
import Member from './Member';

const Members = (props) => {
  // const messages = props.messages

  const messages = props.messages

  let participants = []
  const [members, setMembers] = useState([]);

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
    <div>
      <ul className="list-group">
        {console.log(members)}
        {members.map((member, index) => (
          <li key={index}>{member}</li>)
      )}
      </ul>
    </div>
  //   <div>
  //     {/* {console.log("ma: ",members)}
  //     {console.log("m: ",members[0])}
  //     {(members[0]).map((mem, idx) => {
  //       return <div>
  //         <h3>{mem}</h3>
  //       </div>
  //     })} */}
  //   </div>
  )
}

export default Members