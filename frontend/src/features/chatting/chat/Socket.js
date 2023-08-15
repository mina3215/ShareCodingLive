// socket 통신
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, { useState, useEffect } from 'react';

import TabContainer from './TabContainer';
import Members from './Members';

// socket 통신을 위한 변수
let sock = new SockJS('https://www.sclive.link/api/ws/chat');
let ws = Stomp.over(sock);
let reconnect = 0;

// TODO 추후에 props로 roomId(uuid), nickname(string) 주입해주기.

const sender = 'nickname' + Math.floor(Math.random() * 100);

const Socket = (props) => {
  console.log('손들기 확인', props.handUp);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const roomId = props.uuid;
  const handUp = props.handUp;
  // // 손 든 정보를 props로 받아옴.
  // const hand = props.hand

  // 손들기 테스트용
  // const [hand, setHand] = useState(false)

  // // 이거도 손들기 테스트용
  // const changeHand = () => {
  //   setHand(!hand)
  // }

  // 화면 처음 랜더링 되면 소켓 연결
  useEffect(() => {
    sock = new SockJS('https://www.sclive.link/api/ws/chat');
    ws = Stomp.over(sock);
    connectWebSocket();
  }, []);

  // 창 닫기 해도 QUIT 메시지 보내서 참가자 목록 수정하도록 하기 위한 useEffect
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      offConnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // hand 데이터 받아오면 handup인지 handdown인지 채팅 보내기
  useEffect(() => {
    if (ws.connected) {
      if (handUp) {
        console.log('손 들었오~');
        console.log('hand is true: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_UP', roomId, sender, messag: '' }));
      } else if (!handUp) {
        console.log('hand is false: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_DOWN', roomId, sender, messag: '' }));
      }
    }
  }, [handUp]);

  const connectWebSocket = () => {
    console.log('변경변경');
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
          const newsock = new SockJS('https://www.sclive.link/api/ws/chat');
          const newws = Stomp.over(newsock);
          connectWebSocket(newws);
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
      {/* <button onClick={changeHand}>손들기</button>

      <button onClick={changeTab}>채팅 or 참가자</button> */}
    </div>
  );
};

export default Socket;
