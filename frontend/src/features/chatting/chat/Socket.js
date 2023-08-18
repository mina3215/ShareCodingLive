// socket 통신
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import React, { useState, useEffect } from 'react';

import TabContainer from './TabContainer';
import Members from './Members';

import { useNavigate } from 'react-router-dom';

// socket 통신을 위한 변수
let sock = new SockJS('https://www.sclive.link/api/ws/chat');
let ws = Stomp.over(sock);
let reconnect = 0;

// TODO 추후에 props로 roomId(uuid), nickname(string) 주입해주기.

const Socket = (props) => {
  const sender = localStorage.getItem('nick');
  console.log('손들기 확인', props.handUp);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const roomId = props.uuid;
  const handUp = props.handUp;

  // 나갔는지 받아오는 변수
  const isExit = props.isExit;

  // 내가 호스트 인지 아닌지 판별하는 변수
  const isHost = props.isHost;

  const Navigate = useNavigate();
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

  // isExit 변수 바뀌면 연결 끊기. 미팅 페이지에서 나가기 누르면 isExit 변수 값 바꾸고 이거 props로 줘서 이 변수 바뀌면 채팅 소켓 끊어버림
  useEffect(() => {
    if (isExit) {
      offConnect();
    }
  }, [isExit]);

  // hand 데이터 받아오면 handup인지 handdown인지 채팅 보내기
  useEffect(() => {
    if (ws.connected) {
      if (handUp && !isHost) {
        console.log('hand is true: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_UP', roomId, sender, messag: '' }));
      } else if (!handUp && !isHost) {
        console.log('hand is false: ', ws);
        ws.send('/app/chat/message', {}, JSON.stringify({ type: 'HAND_DOWN', roomId, sender, messag: '' }));
      }
    }
  }, [handUp]);

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
    Navigate('/');
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
