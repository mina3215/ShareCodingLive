import React, { useState, useRef, Fragment } from 'react';
import ChattingTab from './ChattingTab';
import CodeTab from './CodeTab';
import QuestionTab from './QuestionTab';

//style
import styled from 'styled-components';
import chattingIcon_white from '../../../assets/chattingIcon_white.png';
import chattingIcon_black from '../../../assets/chattingIcon_black.png';
import codingIcon_white from '../../../assets/codingIcon_white.png';
import codingIcon_black from '../../../assets/codingIcon_black.png';
import questionmark_white from '../../../assets/questionmark_white.png';
import questionmark_black from '../../../assets/questionmark_black.png';

// socket 통신
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect } from 'react';

const TabContainerWrapper = styled.div`
  height: 83vh; /* Set a specific height for the chat container */
  margin: 0 auto;
  padding: 20px;
  border: none;
  background-color: #242424;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Enable vertical scrolling when content overflows */
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: space-between;
  // margin-bottom: 10px;
  height: 8vh;
  border: none;
`;

const TabButton = styled.button`
  flex: 1; /* Distribute equally within the container */
  padding: 0px 15px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b9b9b9;
    border: none;
  }

  &.active {
    background-color: #242424;
    border: none;
    color: #fff;
  }
`;

const TextInputWrapper = styled.div`
  display: flex;
  // margin-top: 10px;
  // margin-bottom: 0px;
  height: 9vh;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  outline: none;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  background-color: #3b7ddd;
  color: #fff;
  border: none;
  // border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #418eff;
    color: #242424;
  }
`;

const CustomImg = styled.img`
  width: 40px;
  height: 40px;
  margin: auto;
`;

// socket 통신을 위한 변수
let sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
// console.log(sock)
let ws = Stomp.over(sock);
let reconnect = 0;

// TODO 추후에 props로 roomId(uuid), nickname(string) 주입해주기.
const roomId = localStorage.getItem('wschat.roomId');
const sender = localStorage.getItem('wschat.sender');

// 함수 컴포넌트
const TabContainer = () => {
  const [activeTab, setActiveTab] = useState('chat');

  // 채팅을 위한 메시지
  const [message, setMessage] = useState('');
  // 주고받은 전체 메시지
  const [messages, setMessages] = useState([]);

  const inputRef = useRef();

  const chatContainerRef = useRef();

  useEffect(() => {
    connectWebSocket();
  }, []);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    scrollToBottom();
  }, [messages]);

  // inputValue가 ``````가 되거나 ??가 되면 중간에 커서 보내기 위해서 moveCursorToMiddle()함수를 호출할건데
  // 그냥 handleInputChange 함수에서 호출하면 제대로 안먹혀서 useEffect로 해야 됨.
  useEffect(() => {
    if (message.length === 2 && message === '??') {
      console.log('Input Value in useEffect: ', message);
      moveCursorToMiddle();
    } else if (message.length === 6 && message === '``````') {
      console.log('Input Value in useEffect: ', message);
      moveCursorToMiddle();
    }
  }, [message]);

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

  const handleTabChange = (tabRoom) => {
    setActiveTab(tabRoom);
  };

  const connectWebSocket = () => {
    const onConnect = () => {
      console.log('roomId ready? : ', roomId);
      ws.subscribe(`/topic/chat/room/${roomId}`, (message) => {
        const recv = JSON.parse(message.body);
        console.log('recv', recv);
        recvMessage(recv);
      });
      ws.send('/app/chat/message', {}, JSON.stringify({ type: 'ENTER', roomId, sender }));
    };

    const onReconnect = (error) => {
      if (reconnect++ <= 5) {
        setTimeout(() => {
          console.log('Connection reconnect');
          sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
          ws = Stomp.over(sock);
          connectWebSocket(sock);
        }, 10 * 1000);
      }
    };

    ws.connect({}, onConnect, onReconnect);
  };

  // 채팅 보내기
  const sendMessage = () => {
    ws.send('/app/chat/message', {}, JSON.stringify({ type: 'TALK', roomId, sender, message }));
    setMessage('');
  };

  // 채팅 받기
  const recvMessage = (recv) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: recv.type,
        sender: recv.type === 'ENTER' ? '[알림]' : recv.sender,
        message: recv.message,
        time: recv.sendTime,
        title: recv.title,
        summarization: recv.summarization,
      },
    ]);
  };

  // socket 연결 끊기
  const offConnect = () => {
    ws.send('/app/chat/message', {}, JSON.stringify({ type: 'QUIT', roomId, sender }));
    ws.disconnect();
    console.log('socket 끊김');
  };

  // 인풋창에 백틱, 물음표 추가, 백스페이스 누를때 / 엔터 누를때 다르게 동작

  // ```을 입력하면 뒤에 ```을 넣어주고, ?를 입력하면 뒤에 ?를 넣어주는 함수
  const handleInputChange = (event) => {
    const newinput = event.target.value;
    setMessage(newinput);

    if (event.target.value.length === 1 && event.target.value === '?') {
      setMessage('??');
      console.log('Input Value in handleInputChange: ', message);
    } else if (event.target.value.length === 3 && event.target.value === '```') {
      setMessage('``````');
      console.log('Input Value in handleInputChange: ', message);
    }
  };

  // 커서를 prefix 중간으로 보내는 함수
  const moveCursorToMiddle = () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      const middleIndex = Math.floor(inputValue.length / 2);
      inputRef.current.focus();
      inputRef.current.setSelectionRange(middleIndex, middleIndex);
    }
  };

  // 입력창에서 백스페이스 누를때, 엔터 누를때 다르게 동작
  const handleKeyPress = (event) => {
    // 물음표가 있을때 백스페이스 누르면
    if (event.key === 'Backspace' && message === '??') {
      // event.preventDefault(); // 기본 동작 막기
      // 인풋창 빈 문자열로 만들기(물음표 없애기)
      setMessage('');
    }
    // 백틱이 있을때 백스페이스 누르면
    else if (event.key === 'Backspace' && message === '`````') {
      // event.preventDefault(); // 기본 동작 막기
      // 인풋창 빈 문자열로 만들기(백틱 없애기)
      setMessage('');
    }
    // 엔터키 누르면 메시지 보내기
    else if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Fragment>
      {/* 버튼 눌러서 채팅창, 코드, 질문 창 바꿀 탭 */}
      <TabButtons>
        <TabButton className="nav-link" onClick={() => handleTabChange('chat')}>
          {activeTab === 'chat' ? (
            <CustomImg src={chattingIcon_white} alt="chattingIcon_white" />
          ) : (
            <CustomImg src={chattingIcon_black} alt="chattingIcon_black" />
          )}
        </TabButton>
        <TabButton className="nav-link" onClick={() => handleTabChange('code')}>
          {activeTab === 'code' ? (
            <CustomImg src={codingIcon_white} alt="codingIcon_white" />
          ) : (
            <CustomImg src={codingIcon_black} alt="codingIcon_black" />
          )}
        </TabButton>
        <TabButton className="nav-link" onClick={() => handleTabChange('question')}>
          {activeTab === 'question' ? (
            <CustomImg src={questionmark_white} alt="questionmark_white" />
          ) : (
            <CustomImg src={questionmark_black} alt="questionmark_black" />
          )}
        </TabButton>
      </TabButtons>
      <TabContainerWrapper ref={chatContainerRef}>
        {/*  눌린 버튼에 따라서 보여줄 채팅창 */}
        <div className="tab-content">
          {activeTab === 'chat' && <ChattingTab messages={messages} />}
          {activeTab === 'code' && <CodeTab messages={messages} />}
          {/* {activeTab === 'question' && <QuestionTab messages={messages}/>} */}
          {activeTab === 'question' && <QuestionTab messages={messages} />}
        </div>
      </TabContainerWrapper>

      {/* 메시지 입력창 */}
      <TextInputWrapper>
        <TextInput
          id="myTextarea"
          ref={inputRef}
          type="text"
          className="form-control"
          value={message}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          // onKeyDown하면 안됨. enter 누르자 마자 먹히니까 \n이 포함되는 듯
        />
        {/* 보내기 버튼 */}
        <SendButton onClick={sendMessage}>보내기</SendButton>
      </TextInputWrapper>

      {/* socket 끊기용 테스트 버튼 */}
      {/* <div className="input-group-append">
        <button className="btn btn-primary" type="button" onClick={offConnect}>
          채팅 나가기
        </button>
      </div> */}
    </Fragment>
  );
};

export default TabContainer;
