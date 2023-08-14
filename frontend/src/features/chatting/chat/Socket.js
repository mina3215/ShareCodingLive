// socket 통신
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, { useState, useEffect } from 'react';

import TabContainer from './TabContainer';
import Members from './Members';

// import axios from '../../common/api/http-common';

// socket 통신을 위한 변수
// let sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');

let sock = new SockJS('https://i9d109.p.ssafy.io/api/ws/chat');
console.log(sock);
let ws = Stomp.over(sock);
console.log(ws)
let reconnect = 0;

// TODO 추후에 props로 roomId(uuid), nickname(string) 주입해주기.
const roomId = localStorage.getItem('wschat.roomId');
const sender = localStorage.getItem('wschat.sender');

const Socket = (props) => {
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // // 손 든 정보를 props로 받아옴.
  // const hand = props.hand

  // 손들기 테스트용
  const [hand, setHand] = useState(false);

  const changeHand = () => {
    setHand(!props.handUp);
  };

  // 코드, 채팅, 질문 탭 선택하기 위한 함수
  // const [activeChatTab, setActiveChatTab] = useState(false);
  // const [activeParticipantsTab, setActiveParticipantsTab] = useState(true);
  // const changeTab = () => {
  //   setActiveChatTab(!activeChatTab);
  //   setActiveParticipantsTab(!activeParticipantsTab);
  // };

  // const [chatmessage, setChatMessage] = useState([])

  // const [memmessage, setMemMessage] = useState([])

  // 화면 처음 랜더링 되면 소켓 연결
  useEffect(() => {
    connectWebSocket();
  }, []);

  // 창 닫기 해도 QUIT 메시지 보내서 참가자 목록 수정하도록 하기 위한 useEffect
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      offConnect();
      // event.preventDefault();
      // event.returnValue = '메롱'; // 이 줄은 브라우저 종류에 따라 필요할 수 있습니다.
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // hand 데이터 받아오면 handup인지 handdown인지 채팅 보내기
  useEffect(() => {
    if (ws.connected) {
      if (props.handUp) {
        console.log('hand is true: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_UP', roomId, sender, messag: '' }));
      } else if (!props.handUp) {
        console.log('hand is false: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_DOWN', roomId, sender, messag: '' }));
      }
    }
  }, [props.handUp]);

  const connectWebSocket = () => {
    const onConnect = () => {
      console.log('roomId ready? : ', roomId);
      ws.subscribe(`/topic/chat/room/${roomId}`, (message) => {
        const recv = JSON.parse(message.body);
        console.log('recv', recv);
        recvMessage(recv);
      });
      ws.send('/app/chat/message', {}, JSON.stringify({ type: 'ENTER', roomId, sender, message }));
    };

    const onReconnect = (error) => {
      if (reconnect++ <= 5) {
        setTimeout(() => {
          console.log('Connection reconnect');
          // const newsock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
          const newsock = new SockJS('https://i9d109.p.ssafy.io/api/ws/chat');
          const newws = Stomp.over(newsock);
          connectWebSocket(newws);
          // sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
          // ws = Stomp.over(sock);
          // connectWebSocket(sock);
        }, 10 * 1000);
      }
    };

    ws.connect({}, onConnect, onReconnect);
  };

  // 채팅 보내기
  const sendMessage = (message) => {
    ws.send('/app/chat/message', {}, JSON.stringify({ type: 'TALK', roomId, sender, message }));
    setMessage('');
  };

  // 채팅 받기
  const recvMessage = (recv) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: recv.type,
        sender: recv.sender,
        message: recv.message,
        time: recv.sendTime,
        title: recv.title,
        summarization: recv.summarization,
        participants: recv.participants,
        language: recv.language,
      },
    ]);
  };
  // const recvMessage = (recv) => {
  //   console.log("recvMessage: ", recv)
  //   // 참가자 관련 메시지
  //   if (recv.type === 'ENTER' || recv.type === 'QUIT') {
  //     setMemMessage((prevMemMerbers) => [
  //       ...prevMemMerbers,
  //       { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},

  //     ]);
  //   }
  //   // 채팅 관련 메시지
  //   else if (recv.type === 'TALK' || recv.type === 'CODE' || recv.type === 'QUESTION') {
  //     setChatMessage((prevChatMessage) => [
  //       ...prevChatMessage,
  //       { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime , title: recv.title, summarization: recv.summarization},

  //     ]);

  //   }
  // }

  // socket 연결 끊기
  const offConnect = () => {
    ws.send('/app/chat/message', {}, JSON.stringify({ type: 'QUIT', roomId, sender, message: '' }));
    ws.disconnect();
    console.log('socket 끊김');
  };

  return (
    <div>
      {props.showChat === true && (
        <TabContainer messages={messages} propsfunction1={sendMessage} propsfunction2={offConnect} />
      )}
      {props.showMember === true && <Members messages={messages} />}
      {/* <TabContainer messages={messages} propsfunction1={sendMessage} propsfunction2={offConnect}/> */}
      {/* <Members messages={messages}/> */}

      {/* <button onClick={changeHand}>손들기</button> */}

      {/* <button onClick={changeTab}>채팅 or 참가자</button> */}
      {/* <TabContainer
        messages={messages}
        propsfunction1={sendMessage}
        propsfunction2={offConnect}
        style={{ visibility: props.showChat ? 'hidden' : 'visible' }}
      />
      <Members messages={messages} style={{ visibility: props.showMember ? 'visible' : 'hidden' }} /> */}
    </div>
  );
};

export default Socket;
