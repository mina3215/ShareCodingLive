import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import DialogExtensionComponent from './dialog-extension/DialogExtension';
import StreamComponent from './stream/StreamComponent';
import './VideoRoomComponent.css';

import OpenViduLayout from './layout/openvidu-layout';
import UserModel from './models/user-model';
import ToolbarComponent from './toolbar/ToolbarComponent';

// css
import styled from 'styled-components';


const ParticipantCams = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    top : 0;
    width : 100%;
    height : 30%;
    background-color: #282828;
    z-index: 9999;
`

const Toolbar = styled.div`
    position: absolute;
    display: flex;
    bottom : 0;
    background-color: #282828;
    width : 100%;
    height : 10%;
`

const Cam = styled.div`
    position: relative;
    width: 310px;
    height: 90%;
    overflow: hidden;
    margin-right: 15px;
    margin-left: 15px;
    flex-shrink: 0;
    & div {
        position: absolute;
        width: 100%;
        height: 100%;
    }

`

var localUser = new UserModel();
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.100.134:5000/';
const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.100.190:5000/';



class VideoRoomComponent extends Component {
    constructor(props) {
        super(props);
        this.hasBeenUpdated = false;
        this.layout = new OpenViduLayout();
        let sessionName = this.props.sessionName ? this.props.sessionName : 'SessionAB';
        let userName = this.props.user ? this.props.user : 'OpenVidu_User' + Math.floor(Math.random() * 100);
        this.remotes = [];
        this.localUserAccessAllowed = false;
        this.state = {
            mySessionId: sessionName,
            myUserName: userName,
            session: undefined,
            localUser: undefined,
            subscribers: [],
            chatDisplay: 'none',
            currentVideoDevice: undefined,
            isRoomAdmin : false,
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.camStatusChanged = this.camStatusChanged.bind(this);
        this.micStatusChanged = this.micStatusChanged.bind(this);
        this.nicknameChanged = this.nicknameChanged.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.closeDialogExtension = this.closeDialogExtension.bind(this);
        this.checkNotification = this.checkNotification.bind(this);
    }

    componentDidMount() {
        const openViduLayoutOptions = {
            maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
            minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
            fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
            bigClass: 'OV_big', // The class to add to elements that should be sized bigger
            bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
            bigFixedRatio: false, // fixedRatio for the big ones
            bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
            bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
            bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
            animate: true, // Whether you want to animate the transitions
        };

        this.layout.initLayoutContainer(document.getElementById('layout'), openViduLayoutOptions);
        window.addEventListener('beforeunload', this.onbeforeunload);
        this.joinSession();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
        this.leaveSession();
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    joinSession() {
        this.OV = new OpenVidu();

        this.setState(
            {
                session: this.OV.initSession(),
            },
            async () => {
                this.subscribeToStreamCreated();
                await this.connectToSession();
            },
        );
    }

    async connectToSession() {
        if (this.props.token !== undefined) {
            console.log('token received: ', this.props.token);
            this.connect(this.props.token);
        } else {
            try {
                var token = await this.getToken();
                console.log(token);
                this.connect(token);
            } catch (error) {
                console.error('There was an error getting the token:', error.code, error.message);
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
                alert('There was an error getting the token:', error.message);
            }
        }
    }

    connect(token) {
        this.state.session
            .connect(
                token,{ 
                  clientData: this.state.myUserName,
                  admin: this.state.isRoomAdmin,   
                },
            )
            .then(() => {
                this.connectWebCam();
            })
            .catch((error) => {
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
                alert('There was an error connecting to the session:', error.message);
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }

    async connectWebCam() {
        await this.OV.getUserMedia({ audioSource: undefined, videoSource: undefined });
        var devices = await this.OV.getDevices();
        var videoDevices = devices.filter(device => device.kind === 'videoinput');

        let publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: videoDevices[0].deviceId,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            resolution: '320x240',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror : false,
        });

        if (this.state.session.capabilities.publish) {
            publisher.on('accessAllowed' , () => {
                this.state.session.publish(publisher).then(() => {
                    this.updateSubscribers();
                    this.localUserAccessAllowed = true;
                    if (this.props.joinSession) {
                        this.props.joinSession();
                    }
                });
            });

        }
        localUser.setNickname(this.state.myUserName);
        localUser.setConnectionId(this.state.session.connection.connectionId);
        localUser.setScreenShareActive(false);
        localUser.setStreamManager(publisher);
        this.subscribeToUserChanged();
        this.subscribeToStreamDestroyed();
        this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });

        this.setState({ currentVideoDevice: videoDevices[0], localUser: localUser }, () => {
            this.state.localUser.getStreamManager().on('streamPlaying', (e) => {
                publisher.videos[0].video.parentElement.classList.remove('custom-class');
            });
        });
    }

    updateSubscribers() {
        var subscribers = this.remotes;
        this.setState(
            {
                subscribers: subscribers,
            },
            () => {
                if (this.state.localUser) {
                    this.sendSignalUserChanged({
                        isAudioActive: this.state.localUser.isAudioActive(),
                        isVideoActive: this.state.localUser.isVideoActive(),
                        nickname: this.state.localUser.getNickname(),
                        isScreenShareActive: this.state.localUser.isScreenShareActive(),
                    });
                }
            },
        );
    }

    leaveSession() {
        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: 'SessionA',
            myUserName: 'OpenVidu_User' + Math.floor(Math.random() * 100),
            localUser: undefined,
        });
        if (this.props.leaveSession) {
            this.props.leaveSession();
        }
    }
    camStatusChanged() {
        localUser.setVideoActive(!localUser.isVideoActive());
        try{
        localUser.getStreamManager().publishVideo(localUser.isVideoActive());
        this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
        this.setState({ localUser: localUser });
        }catch(error){
            console.log(localUser.getStreamManager().publishVideo(localUser.isVideoActive()))
            alert('현재 카메라를 켤 수 있는 비디오가 없습니다. 잠시후 다시 시도하세요 ')
        }
    }

    micStatusChanged() {
        localUser.setAudioActive(!localUser.isAudioActive());
        localUser.getStreamManager().publishAudio(localUser.isAudioActive());
        this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
        this.setState({ localUser: localUser });
    }

    nicknameChanged(nickname) {
        let localUser = this.state.localUser;
        localUser.setNickname(nickname);
        this.setState({ localUser: localUser });
        this.sendSignalUserChanged({ nickname: this.state.localUser.getNickname() });
    }

    deleteSubscriber(stream) {
        const remoteUsers = this.state.subscribers;
        const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
        let index = remoteUsers.indexOf(userStream, 0);
        if (index > -1) {
            remoteUsers.splice(index, 1);
            this.setState({
                subscribers: remoteUsers,
            });
        }
    }

    subscribeToStreamCreated() {
        this.state.session.on('streamCreated', (event) => {
            const subscriber = this.state.session.subscribe(event.stream, undefined);
            console.log('비디오타입',event.stream.typeOfVideo)
            subscriber.on('streamPlaying', (e) => {
                this.checkSomeoneShareScreen();
                subscriber.videos[0].video.parentElement.classList.remove('custom-class');
            });
            const newUser = new UserModel();
            newUser.setStreamManager(subscriber);
            newUser.setConnectionId(event.stream.connection.connectionId);
            newUser.setType('remote');
            const nickname = event.stream.connection.data.split('%')[0];
            newUser.setNickname(JSON.parse(nickname).clientData);
            this.remotes.push(newUser);
            if(this.localUserAccessAllowed) {
                this.updateSubscribers();
            }
        });
    }

    subscribeToStreamDestroyed() {
        // On every Stream destroyed...
        this.state.session.on('streamDestroyed', (event) => {
            // Remove the stream from 'subscribers' array
            this.deleteSubscriber(event.stream);
            setTimeout(() => {
                this.checkSomeoneShareScreen();
            }, 20);
            event.preventDefault();
            this.updateLayout();
        });
    }

    subscribeToUserChanged() {
        this.state.session.on('signal:userChanged', (event) => {
            let remoteUsers = this.state.subscribers;
            remoteUsers.forEach((user) => {
                if (user.getConnectionId() === event.from.connectionId) {
                    const data = JSON.parse(event.data);
                    console.log('EVENTO REMOTE: ', event.data);
                    if (data.isAudioActive !== undefined) {
                        user.setAudioActive(data.isAudioActive);
                    }
                    if (data.isVideoActive !== undefined) {
                        user.setVideoActive(data.isVideoActive);
                    }
                    if (data.nickname !== undefined) {
                        user.setNickname(data.nickname);
                    }
                    if (data.isScreenShareActive !== undefined) {
                        user.setScreenShareActive(data.isScreenShareActive);
                    }
                }
            });
            this.setState(
                {
                    subscribers: remoteUsers,
                },
                () => this.checkSomeoneShareScreen(),
            );
        });
    }

    // updateLayout() {
    //     setTimeout(() => {
    //         this.layout.updateLayout();
    //     }, 20);
    // }

    sendSignalUserChanged(data) {
        const signalOptions = {
            data: JSON.stringify(data),
            type: 'userChanged',
        };
        this.state.session.signal(signalOptions);
    }

    toggleFullscreen() {
        const document = window.document;
        console.log('오긴오몽모오모오몸ㅇ')
        console.log('에프에스', document.getElementById('container'));
        const fs = document.getElementById('container');
        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement
        ) {
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            } else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            } else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            } else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }


    screenShare() {
        const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
        console.log('비디오 소스', videoSource)
        const publisher = this.OV.initPublisher(
            undefined,
            {
                videoSource: videoSource,
                publishAudio: localUser.isAudioActive(),
                publishVideo: localUser.isVideoActive(),
                mirror: false,
            },
            (error) => {
                if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
                    this.setState({ showExtensionDialog: true });
                } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
                    alert('Your browser does not support screen sharing');
                } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
                    alert('You need to enable screen sharing extension');
                } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
                    alert('You need to choose a window or application to share');
                }
            },
        );

        publisher.once('accessAllowed', () => {
            this.state.session.unpublish(localUser.getStreamManager());
            localUser.setStreamManager(publisher);
            if(publisher.stream.getMediaStream()){
               publisher.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                	
                    this.state.session.unpublish(publisher);
                    this.connectWebCam();
                })
            }
            this.state.session.publish(localUser.getStreamManager()).then(() => {
                localUser.setScreenShareActive(true);
                this.setState({ localUser: localUser }, () => {
                    this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
                });
            });
        });

        
        publisher.on('streamPlaying', () => {
            publisher.videos[0].video.parentElement.classList.remove('custom-class');
        });
    }

    closeDialogExtension() {
        this.setState({ showExtensionDialog: false });
    }


    stopScreenShare() {
        this.state.session.unpublish(localUser.getStreamManager());
        this.connectWebCam();
    }

    checkSomeoneShareScreen() {
        let isScreenShared;
        // return true if at least one passes the test
        isScreenShared = this.state.subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive();
        const openviduLayoutOptions = {
            maxRatio: 3 / 2,
            minRatio: 9 / 16,
            fixedRatio: isScreenShared,
            bigClass: 'OV_big',
            bigPercentage: 0.8,
            bigFixedRatio: false,
            bigMaxRatio: 3 / 2,
            bigMinRatio: 9 / 16,
            bigFirst: true,
            animate: true,
        };
        this.layout.setLayoutOptions(openviduLayoutOptions);
    }


    checkNotification(event) {
        this.setState({
            messageReceived: this.state.chatDisplay === 'none',
        });
    }


    render() {
        const mySessionId = this.state.mySessionId;
        const localUser = this.state.localUser;
        let camNumbers = 3;

        return (
            <div>
                <DialogExtensionComponent showDialog={this.state.showExtensionDialog} cancelClicked={this.closeDialogExtension} />

                <div id="container">
                    <ParticipantCams >
                        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
                            <Cam>
                                <StreamComponent user={localUser} handleNickname={this.nicknameChanged} />
                            </Cam>
                        )}

                        {/* TODO: 창 줄이거나 채팅창 켜지면 사람 수 조절  */}
                        {/* TODO: 옆으로 넘어가는 케러셀 제작 */}
                        {this.state.subscribers.map((sub, i) => (
                            (i<=camNumbers)? (
                            <Cam key={i} >
                                {console.log('이건 구독자 번호인가요',i)}
                                <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
                            </Cam>
                            ): null
                        ))}
                    </ParticipantCams>
                    {/* TODO: 호스트 캠, 스크린 두기 */}
                </div>
                <Toolbar>
                    <ToolbarComponent
                        sessionId={mySessionId}
                        user={localUser}
                        showNotification={this.state.messageReceived}
                        camStatusChanged={this.camStatusChanged}
                        micStatusChanged={this.micStatusChanged}
                        screenShare={this.screenShare}
                        stopScreenShare={this.stopScreenShare}
                        toggleFullscreen={this.toggleFullscreen}
                        leaveSession={this.leaveSession}
                    />
                </Toolbar>
            </div>
        );
    }
    async getToken() {
        const sessionId = await this.createSession(this.state.mySessionId);
        return await this.createToken(sessionId);
    }

    async createSession(sessionId) {
        // TODO: 세션 생성 시 호스트 판별
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    }

    async createToken(sessionId) {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The token
    }
}
export default VideoRoomComponent;