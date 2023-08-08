import React, { useState } from 'react';
import VideoRoomComponent from './VideoRoomComponent';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import TabContainer from '../chatting/chat/TabContainer';
import { useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

const VideoRoomWrapper = styled.div`
  width: ${({ showChat }) => (showChat ? '75%' : '100%')};
  transition: width 0.3s ease-in-out;
`;

const TabContainerWrapper = styled.div`
  width: ${({ showChat }) => (showChat ? '25%' : '0%')};
  transition: width 0.3s ease-in-out;
`;

function MeetingPage(props) {
  const { state } = useLocation();

  const [showChat, setShowChat] = useState(false);

  const handleToggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  return (
    <Wrapper>
      <VideoRoomWrapper showChat={showChat}>
        <VideoRoomComponent uuid={state.uuid} isHost={state.isHost} handleToggleChat={handleToggleChat} />
      </VideoRoomWrapper>
      <TabContainerWrapper showChat={showChat}>
        <TabContainer />
      </TabContainerWrapper>
    </Wrapper>
  );
}

export default MeetingPage;
