import React from 'react';
import VideoRoomComponent from './VideoRoomComponent';
// css
import { Container, Grid } from '@material-ui/core';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  background-color: #404040;
`


function MeetingPage() {

  const { state } = useLocation();

  return (
    <Wrapper>
      <VideoRoomComponent 
        uuid={state.uuid}
        isHost = {state.isHost}
      />
    </Wrapper>
  );
}
export default MeetingPage;

