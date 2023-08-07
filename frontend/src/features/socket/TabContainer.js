import React, { useState, useRef } from 'react';
import ChattingTab from './ChattingTab';
import CodeTab from './CodeTab';
import QuestionTab from './QuestionTab';

// // socket 통신
// import SockJS from 'sockjs-client';
// import Stomp from "stompjs";
import {useEffect} from 'react';

// socket 통신을 위한 변수
// let sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
// console.log(sock)
// let ws = Stomp.over(sock);
// let reconnect = 0;

// TODO 추후에 props로 roomId(uuid), nickname(string) 주입해주기.
// const roomId = localStorage.getItem('wschat.roomId')
// const sender = localStorage.getItem('wschat.sender')

// let chatmessages = []

// 함수 컴포넌트
const TabContainer = (props) => {
  const messages = props.messages
  // const propmessage = props.chatmessage
  const [activeTab, setActiveTab] = useState('chat');
  console.log('넘어와라라라라라라라라라', props);

  // 채팅을 위한 보낼 메시지
  const [message, setMessage] = useState('');

  // // 주고받은 전체 메시지
  // const [messages, setMessages] = useState([]);

  // 참가자 확인
  // const [members, setMembers] = useState([])

  // // 코드 관련 메시지
  // const [codes, setCodes] = useState([]);

  // // 질문 관련 메시지
  // const [questions, setQuestions] = useState([]);


  // // 채팅 관련 메시지
  // const [chats, setChats] = useState([]);


  const inputRef = useRef();

  // useEffect(() => {
  //   classifyMessage(props.chatmessage);
  // }, [props.chatmessage]);

  // inputValue가 ``````가 되거나 ??가 되면 중간에 커서 보내기 위해서 moveCursorToMiddle()함수를 호출할건데
  // 그냥 handleInputChange 함수에서 호출하면 제대로 안먹혀서 useEffect로 해야 됨.
  useEffect(() => {
    if (message.length === 2 && message === '??') {
      console.log("Input Value in useEffect: ", message)
      moveCursorToMiddle();
    }
    else if (message.length === 6 && message === '``````') {
      console.log("Input Value in useEffect: ", message)
      moveCursorToMiddle();
    }

  }, [message])

  // // 창 닫기 해도 QUIT 메시지 보내서 참가자 목록 수정하도록 하기 위한 useEffect
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     offConnect()
  //     // event.preventDefault();
  //     // event.returnValue = '메롱'; // 이 줄은 브라우저 종류에 따라 필요할 수 있습니다.
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);



  const handleTabChange = (tabRoom) => {
    setActiveTab(tabRoom);
  };

  // const connectWebSocket = () => {

  //   const onConnect = () => {
  //     console.log("roomId ready? : ", roomId)
  //     ws.subscribe(`/topic/chat/room/${roomId}`, (message) => {  
  //       const recv = JSON.parse(message.body);
  //       console.log('recv', recv)
  //       recvMessage(recv);
  //     });
  //     ws.send('/app/chat/message', {}, JSON.stringify({ type: 'ENTER', roomId, sender }));
  //   };

  //   const onReconnect = (error) => {
  //     if (reconnect++ <= 5) {
  //       setTimeout(() => {
  //         console.log('Connection reconnect');
  //         const newsock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
  //         const newws = Stomp.over(newsock);
  //         connectWebSocket(newws);
  //         sock = new SockJS('https://i9d109.p.ssafy.io:8094/api/ws/chat');
  //         ws = Stomp.over(sock);
  //         connectWebSocket(sock);
  //       }, 10 * 1000);
  //     }
  //   };

  //   ws.connect({}, onConnect, onReconnect);
  // };

  // // 채팅 보내기
  // const sendMessage = () => {
  //   ws.send('/app/chat/message', {}, JSON.stringify({ type: 'TALK', roomId, sender, message }));
  //   setMessage('');
  // };

  const sendMessage = () => {
    props.propsfunction1(message)
    setMessage('')
  }

  const offConnect = () => {
    props.propsfunction2()
    setMessage('')
  }


  // // 메시지 분류
  // const classifyMessage = (propmessage) => {
  //   console.log("classifyMessage: ", propmessage)
  //   // 일반 채팅일 경우
  //   if (propmessage.type === 'TALK') {
  //     setChats((prevChats) => [
  //       ...prevChats,
  //       { type: propmessage.type, sender: propmessage.sender, message: propmessage.message, time: propmessage.sendTime},
      
  //     ]);

  //   }
  //   // 질문일 경우
  //   else if (propmessage.type === 'QUESTION') {
  //     setQuestions((prevQuestions) => [
  //       ...prevQuestions,
  //       { type: propmessage.type, sender: propmessage.sender, message: propmessage.message, time: propmessage.sendTime},
      
  //     ]);

  //   }
  //   // 코드일 경우
  //   else if (propmessage.type === 'CODE') {
  //     setCodes((prevCodes) => [
  //       ...prevCodes,
  //       { type: propmessage.type, sender: propmessage.sender, message: propmessage.message, time: propmessage.sendTime , title: propmessage.title, summarization: propmessage.summarization},
      
  //     ]);

  //   }
    
  // };

  // // socket 연결 끊기
  // const offConnect = () => {
  //   ws.send('/app/chat/message', {}, JSON.stringify({ type: 'QUIT', roomId, sender }));
  //   ws.disconnect();
  //   console.log('socket 끊김')
  // }

  // 인풋창에 백틱, 물음표 추가, 백스페이스 누를때 / 엔터 누를때 다르게 동작
  
  // ```을 입력하면 뒤에 ```을 넣어주고, ?를 입력하면 뒤에 ?를 넣어주는 함수
  const handleInputChange = (event) => {
    const newinput = event.target.value
    setMessage(newinput)
    
    if (event.target.value.length === 1 && event.target.value === '?') {
      setMessage('??')
      console.log("Input Value in handleInputChange: ", message)

    }
    else if (event.target.value.length === 3 && event.target.value === '```') {
      setMessage('``````')
      console.log("Input Value in handleInputChange: ", message)

    }
  };

  // 커서를 prefix 중간으로 보내는 함수
  const moveCursorToMiddle = () => {
    if (inputRef.current) {
      const middleIndex = Math.floor(message.length / 2);
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
      setMessage('')
    }
    // 백틱이 있을때 백스페이스 누르면
    else if (event.key === 'Backspace' && message === '`````') {
      // event.preventDefault(); // 기본 동작 막기
      // 인풋창 빈 문자열로 만들기(백틱 없애기)
      setMessage('')
    }
    // 엔터키 누르면 메시지 보내기
    else if (event.key === 'Enter') {
      sendMessage()
    }
  };

  return (
    <div>
      {/* 버튼 눌러서 채팅창, 코드, 질문 창 바꿀 탭 */}
      <div>
        <button className="nav-link" onClick={() => handleTabChange('chat')}>일반 채팅 탭</button>
        <button className="nav-link" onClick={() => handleTabChange('code')}>코드 탭</button>
        <button className="nav-link" onClick={() => handleTabChange('question')}>질문 탭</button>
      </div>
      {/*  눌린 버튼에 따라서 보여줄 채팅창 */}
      <div className="tab-content">
        {activeTab === 'chat' && <ChattingTab messages={messages}/>}
        {activeTab === 'code' && <CodeTab messages={messages}/>}
        {/* {activeTab === 'question' && <QuestionTab messages={messages}/>} */}
        {activeTab === 'question' && <QuestionTab messages={messages}/>}
      </div>

      {/* 메시지 입력창 */}
      <div>
        <textarea
          id="myTextarea"
          ref={inputRef}
          type="text"
          className="form-control"
          value={message}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          // onKeyDown하면 안됨. enter 누르자 마자 먹히니까 \n이 포함되는 듯
        >
        </textarea>
      </div>

      {/* 보내기 버튼 */}
      <div className="input-group-append">
        <button className="btn btn-primary" type="button" onClick={sendMessage}>
          보내기
        </button>
      </div>

      socket 끊기용 테스트 버튼
      <div className="input-group-append">
        <button className="btn btn-primary" type="button" onClick={offConnect}>
          채팅 나가기
        </button>
      </div>


    </div>
  );
};

export default TabContainer;
