import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Socket from '../socket/Socket';
import styled from 'styled-components';


import VideoRoomComponent from './VideoRoomComponent';

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
  const location = useLocation();
  const { pathname, state } = location;

  // props 
  const uuid = pathname.slice(9);
  const isHost = state? state.isHost : false;
  
  console.log(uuid, isHost);
  
  const [showChat, setShowChat] = useState(false);
  const handleToggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };
  return (
    <Wrapper>
      <VideoRoomWrapper showChat={showChat}>
        <VideoRoomComponent uuid={uuid} isHost={isHost} handleToggleChat={handleToggleChat} />
      </VideoRoomWrapper>
      <TabContainerWrapper  showChat={showChat}>
        <Socket uuid={uuid}  />
      </TabContainerWrapper>
    </Wrapper>
  );
}

export default MeetingPage;
