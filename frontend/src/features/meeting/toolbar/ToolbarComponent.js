import React, { Component } from 'react';

import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';

import PictureInPicture from '@material-ui/icons/PictureInPicture';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat'; // 채팅
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // 참가자
import BackHandIcon from '@mui/icons-material/BackHand';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import LogoutIcon from '@mui/icons-material/Logout'; // 나가기

import IconButton from '@material-ui/core/IconButton';

import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  // position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 10%;
  background-color: #282828;
  z-index: 9999;
  & div {
    width: 100%;
    height: 100%;
  }
`;

const Icon = styled(IconButton)`
  height: 100%;
  color: white;
  & svg {
    width: 45px;
    height: 45px;
  }
`;

const UnderBarLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin-left: 20px;
`;

const UnderBarMid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const UnderBarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  margin-right: 20px;
`;

export default class ToolbarComponent extends Component {
  constructor(props) {
    super(props);
    this.toggleChat = this.toggleChat.bind(this);
    this.toggleMember = this.toggleMember.bind(this);
    this.state = {
      mouseover: false,
    };
    this.camStatusChanged = this.camStatusChanged.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.screenShare = this.screenShare.bind(this);
    this.stopScreenShare = this.stopScreenShare.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handsUp = this.handsUp.bind(this);
    this.toggleCapture = this.toggleCapture.bind(this);
  }

  handsUp() {
    if (!this.props.user.isHost()) {
      this.props.handsUp();
    }
  }

  micStatusChanged() {
    this.props.micStatusChanged();
  }

  camStatusChanged() {
    this.props.camStatusChanged();
  }

  screenShare() {
    this.props.screenShare();
  }

  stopScreenShare() {
    this.props.stopScreenShare();
  }

  toggleCapture() {
    this.props.setCapture();
  }

  toggleChat() {
    // handleToggleChat prop이 정의되었는지 출력
    console.log(this.props.handleToggleChat);

    // Call the handleToggleChat function passed from the parent component
    this.props.handleToggleChat();
  }

  toggleMember() {
    console.log(this.props.handleToggleMember);
    this.props.handleToggleMember();
  }

  leaveSession() {
    this.props.leaveSession();
  }

  render() {
    const localUser = this.props.user;
    return (
      <Wrapper>
        <div>
          <ToolbarContainer>
            {/* TODO: 아이콘 위치 조절 */}
            <UnderBarLeft>
              <Icon onClick={this.camStatusChanged}>
                {localUser !== undefined && localUser.isVideoActive() ? (
                  <Videocam />
                ) : (
                  <VideocamOff color="secondary" />
                )}
              </Icon>

              <Icon onClick={this.micStatusChanged}>
                {localUser !== undefined && localUser.isAudioActive() ? <Mic /> : <MicOff color="secondary" />}
              </Icon>
            </UnderBarLeft>
            <UnderBarMid>
              <Icon onClick={this.screenShare}>
                {localUser !== undefined && localUser.isScreenShareActive() ? <PictureInPicture /> : <ScreenShare />}
              </Icon>

              {localUser !== undefined && localUser.isScreenShareActive() && (
                <Icon onClick={this.stopScreenShare}>
                  <StopScreenShare color="secondary" />
                </Icon>
              )}

              <Icon onClick={this.toggleMember}>
                <AccountCircleIcon />
              </Icon>

              {/* 채팅 클릭 시 전체 적용 */}
              <Icon onClick={this.toggleChat}>
                <ChatIcon />
              </Icon>

              <Icon onClick={this.handsUp}>
                <BackHandIcon />
              </Icon>

              <Icon onClick={this.toggleCapture}>
                {localUser !== undefined && this.state.fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </Icon>
            </UnderBarMid>
            <UnderBarRight>
              <Icon>
                <LogoutIcon
                  color={this.state.mouseover ? 'error' : 'white'}
                  onClick={this.leaveSession}
                  onMouseEnter={() => this.setState({ mouseover: true })}
                  onMouseLeave={() => this.setState({ mouseover: false })}
                />
              </Icon>
            </UnderBarRight>
          </ToolbarContainer>
        </div>
      </Wrapper>
    );
  }
}
