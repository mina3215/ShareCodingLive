import React from 'react';
import VideoRoomComponent from './VideoRoomComponent';
import ReactDOM from 'react-dom';

// css
import { Container, Grid } from '@material-ui/core';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  background-color: #404040;
`


function MeetingPage(props) {
  return (
    <Wrapper>
      <VideoRoomComponent />
    </Wrapper>
  );
}
export default MeetingPage;

