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
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEffect } from 'react';
const Wrapper = styled.div`
  position: relative;
  z-index: 9999;
`;

const TabContainerWrapper = styled.div`
  height: 82.7vh; /* Set a specific height for the chat container */
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
  background-color: #323232;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #292929;
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
  height: 9.3vh;
`;

const TextInput = styled.input`
  flex: 1;
  border-radius: 0;
  padding: 10px;
  font-size: 16px;
  background-color: #323232;
  border: none;
  outline: none;
  color: white;
  font-family: none;
`;

const SendButton = styled.button`
  padding: 10px 28px;
  font-size: 16px;
  background-color: #3b7ddd;
  background: linear-gradient(to bottom, #3c6ebf, #3f3998);
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

// 함수 컴포넌트
const TabContainer = (props) => {
  // 메시지 받기로 받은 메시지
  const messages = props.messages;
  // 코드, 채팅, 질문 탭 선택하기 위한 함수
  const [activeTab, setActiveTab] = useState('chat');
  // console.log('넘어와라라라라라라라라라', props);

  // 채팅을 위한 보낼 메시지
  const [message, setMessage] = useState('');

  const inputRef = useRef();

  const chatContainerRef = useRef();

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

  const handleTabChange = (tabRoom) => {
    setActiveTab(tabRoom);
  };

  // 메시지 보내기 위한 함수(props로 socket.js에서 받아옴)
  const sendMessage = () => {
    props.propsfunction1(message);
    setMessage('');
  };

  // 소켓 끊기 위한 함수(props로 socket.js에서 받아옴)
  const offConnect = () => {
    props.propsfunction2();
    setMessage('');
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
    <Wrapper>
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
        <SendButton onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'white' }} />
        </SendButton>
      </TextInputWrapper>

      {/* socket 끊기용 테스트 버튼 */}
      <div className="input-group-append">
        {/* <button className="btn btn-primary" type="button" onClick={offConnect}>
          채팅 나가기
        </button> */}
      </div>
    </Wrapper>
  );
};

export default TabContainer;
