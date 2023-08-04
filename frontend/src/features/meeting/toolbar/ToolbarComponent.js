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

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    width:100%;
    height: 100%;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    & div {
        width: 100%;
        height: 100%;
    }
`
const Icon = styled(IconButton)`
    height: 100%;
    color : white; 
    & svg {
        width: 45px;
        height: 45px;
    }
`;

export default class ToolbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fullscreen: false,
            mouseover : false
        };
        this.camStatusChanged = this.camStatusChanged.bind(this);
        this.micStatusChanged = this.micStatusChanged.bind(this);
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        
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

    toggleFullscreen() {
        alert('고쳐야 함!')
        return;

        // local 유저 말고 스크린 있는지 판별해서 그걸로 바꾸기. 스크린이나 호스트?
        this.setState({ fullscreen: !this.state.fullscreen });
        this.props.toggleFullscreen();
    }

    switchCamera() {
        this.props.switchCamera();
    }

    leaveSession() {
        this.props.leaveSession();
    }


    render() {
        const localUser = this.props.user;
        return (
            <Wrapper>
                <div>
                    <div>
                        {/* TODO: 아이콘 위치 조절 */}
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


                        <Icon onClick={this.screenShare}>
                            {localUser !== undefined && localUser.isScreenShareActive() ? <PictureInPicture /> : <ScreenShare />}
                        </Icon>

                        {localUser !== undefined &&
                            localUser.isScreenShareActive() && (
                                <Icon onClick={this.stopScreenShare} >
                                    <StopScreenShare color="secondary" />
                                </Icon>
                        )}

                        <Icon>
                            <AccountCircleIcon/>
                        </Icon>

                        {/* 채팅 클릭 시 전체 적용 */}
                        <Icon>
                            <ChatIcon/>
                        </Icon>

                        <Icon>
                            <SentimentSatisfiedAltIcon />
                        </Icon>


                        <Icon  onClick={this.toggleFullscreen}>
                            {localUser !== undefined && this.state.fullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </Icon>
                        <Icon>
                            <LogoutIcon color={this.state.mouseover ? 'error':'white'} onClick={this.leaveSession} onMouseEnter={()=>this.setState({mouseover:true})} onMouseLeave={()=>this.setState({mouseover:false})} />
                        </Icon>                          
                    </div>
                </div>
            </Wrapper>
        );
    }
}
