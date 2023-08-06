import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';

import DialogExtensionComponent from './dialog-extension/DialogExtension';
import StreamComponent from './stream/StreamComponent';
import UserModel from './models/user-model';
import ToolbarComponent from './toolbar/ToolbarComponent';

import { getToken as getLocalToken } from '../../common/api/JWT-common';

// css
import styled from 'styled-components';
import './VideoRoomComponent.css';
// import { Alert } from '@mui/material';

const HostCam = styled.div`
    position: absolute;
    display: flex;
    width : 50%;
    height: 50%;
    top: 250px;

`

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
    z-index: 0;
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
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

`

var localUser = new UserModel();
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/'; //내로컬
const APPLICATION_SERVER_URL = 'http://119.56.161.229:7777/' ; // 유정양




class VideoRoomComponent extends Component {
    constructor(props) {
        super(props);
        this.hasBeenUpdated = false;
        const uuid = this.props.uuid;
        // TODO: 닉네임 받아오기 
        let userName = this.props.user ? this.props.user : 'OpenVidu_User' + Math.floor(Math.random() * 100);
        const isAdmin = this.props.isAdmin;
        this.remotes = [];
        this.host = undefined;
        this.localUserAccessAllowed = false;
         // const userToken = getLocalToken(); // 주소가 쉐코라랑 달라서 잠깐 보류 
        const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzMzEzMzgsImlhdCI6MTY5MTMzMTMzOCwiZW1haWwiOiJpY2hlcm9tQG5hdmVyLmNvbSIsIm5pY2tuYW1lIjoi6rmA7Jyg7KCVIOqwgOunjOyViOuRoCJ9.xriPNQXzKPot_R2shVqFCszgkcqtAngZhSxZRvVykPk' 
        this.state = {
            mySessionId: uuid,
            myUserName: userName,
            session: undefined,
            localUser: undefined,
            subscribers: [],
            hostUser: undefined,
            chatDisplay: 'none',
            currentVideoDevice: undefined,

            // 추가한 state
            isAdmin : isAdmin, // 나는 host 인가?
            isReact : false, // 손을 들었는가?
            userToken: userToken // localStorage 토큰
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.camStatusChanged = this.camStatusChanged.bind(this);
        this.micStatusChanged = this.micStatusChanged.bind(this);
        this.nicknameChanged = this.nicknameChanged.bind(this);
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.closeDialogExtension = this.closeDialogExtension.bind(this);
        this.checkNotification = this.checkNotification.bind(this);

        this.handsUp = this.handsUp.bind(this);
        this.detectMic = this.detectMic.bind(this);
    }

    // 마운트 시 시작하는 함수
    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
        this.joinSession();
    }

    // 언마운트 시
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
        this.leaveSession();
    }

    // 윈도우 창을 닫을 때 
    onbeforeunload(event) {
        this.leaveSession();
    }

    joinSession() {
        this.OV = new OpenVidu();

        // session은 오픈비두 객체를 initSession한 것.
        this.setState(
            {
                session: this.OV.initSession(),
            },
            async () => {
                this.subscribeToStreamCreated(); // 참여자들의 정보를 불러온다.
                await this.connectToSession(); // 내 세션을 연결시킨다. 
            },
        );
    }

    async connectToSession() {
        // 토큰이 없으면 토큰을 가져와서 해당 토큰을 가진 세션에 connect
        if (this.props.token !== undefined) {
            this.connect(this.props.token);
        } else {
            try {
                var token = await this.getToken();
                this.connect(token);
            } catch (error) {
                console.error('There was an error getting the token:', error.code, error.message);
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
            }
        }
    }

    connect(token) {
        // 내 세션을 새로 연결시킨다. 이때 .connect는 OV.initSession()의 함수. 
        // .connect()는 인자로 세션token, clientData, MetaData를 갖는다. 
        this.state.session
            .connect(
                token,{ 
                  clientData: this.state.myUserName, 
                  admin: this.state.isAdmin,   
                },
            )
            .then(() => {
                // 세션에 성공하면 webcam연결
                this.connectWebCam();
            })
            .catch((error) => {
                if(this.props.error){
                    this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                }
                alert('방 들어가기 실패 !');
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }

    async connectWebCam() {
        // 내 openvidu객체에서 사용가능한 media 목록을 가져온다.
        await this.OV.getUserMedia({ audioSource: undefined, videoSource: undefined });
        // 장치 목록 가져옴. 이때 사용하기에 가장 적합한 장치를 불러옴.
        var devices = await this.OV.getDevices();
        // videoinput종류의 디바이스를 저장한다.
        var videoDevices = devices.filter(device => device.kind === 'videoinput');

        // 첫 publisher 생성.
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

        // 누가 세션 올린거 감지
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

        // 전역 localUser부터 set해주고
        localUser.setRole(this.state.isAdmin);
        localUser.setNickname(this.state.myUserName);
        localUser.setConnectionId(this.state.session.connection.connectionId);
        localUser.setScreenShareActive(false);
        localUser.setStreamManager(publisher);
        
        // 변화 감지를 위해 각종 함수 호출.
        this.subscribeToUserChanged();
        this.subscribeToStreamDestroyed();
        this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });

        // setState해줘야 오류가 안나나봄
        this.setState({ currentVideoDevice: videoDevices[0], localUser: localUser }, () => {
            // 이 시점에서 로딩 끝 
            this.state.localUser.getStreamManager().on('streamPlaying', (e) => {
                publisher.videos[0].video.parentElement.classList.remove('custom-class');
            });
        });

        // 내가 호스트면 sethostUser
        if(localUser.isAdmin()){
            this.setState({ hostUser: localUser});
        }
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
            alert('현재 사용할 수 있는 카메라가 없습니다. 잠시후 다시 시도하세요 ')
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
            subscriber.on('streamPlaying', (e) => {
                this.checkSomeoneShareScreen();
                subscriber.videos[0].video.parentElement.classList.remove('custom-class');
            });
            const newUser = new UserModel();
            newUser.setStreamManager(subscriber);
            newUser.setConnectionId(event.stream.connection.connectionId);
            newUser.setType('remote');
            const clientdata = event.stream.connection.data.split('%')[0];
            newUser.setNickname(JSON.parse(clientdata).clientData);
            newUser.setRole(JSON.parse(clientdata).admin);

            // 구독자 중 호스트가 있으면 hostUser에 넣습니다.
            if (newUser.isAdmin()){
                this.setState({ hostUser : newUser});
                return;
            }
            // 아니면 그냥 구독자
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
            // this.updateLayout();
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
                    if(data.reaction !== undefined){
                        user.setReaction(data.reaction)
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


    sendSignalUserChanged(data) {
        const signalOptions = {
            data: JSON.stringify(data),
            type: 'userChanged',
        };
        this.state.session.signal(signalOptions);
    }

    screenShare() {
        // host가 아니면 화면 공유 막기
        if(!this.state.localUser.isAdmin()){
            alert('host가 아니면 화면공유를 할 수 없습니다.')
            return;
        }
        const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
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
            // 현재 카메라, host 얼굴 캠 제거
            this.state.session.unpublish(localUser.getStreamManager());
            
            // 위에서 선언한 SCREEN publisher를 내 streamManager로 지정 ( 전역 localUser )
            localUser.setStreamManager(publisher);

            // 크롬에서 제공해주는 공유 중지 상단 바 눌렀을 때 종료하는 로직
            if(publisher.stream.getMediaStream()){
               publisher.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                    this.state.session.unpublish(publisher);
                    this.connectWebCam();
                })
            }

            // screen 화면을 공유함.
            this.state.session.publish(localUser.getStreamManager()).then(() => {
                // 전역 localUser 변경 
                localUser.setScreenShareActive(true);
                // state localUser에 전역 localUser의 상태를 지정, hostUser에도 지정 
                this.setState({ localUser: localUser, hostUser:localUser }, () => {
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
        // 화면 공유 두번 눌렀을 때 실행
        this.state.session.unpublish(localUser.getStreamManager());
        this.connectWebCam();
    }

    // 누가 스크린 공유를 시작했는가?
    checkSomeoneShareScreen() {
        let isScreenShared;
        // return true if at least one passes the test
        isScreenShared = this.state.subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive();
    }


    checkNotification(event) {
        this.setState({
            messageReceived: this.state.chatDisplay === 'none',
        });
    }

    // 손 들기 감지 
    handsUp(){
        if(localUser.isReaction() === 'hand'){
            localUser.setReaction(null)
            this.sendSignalUserChanged({reaction: 'none'})
        }else{
            localUser.setReaction('hand');
            console.log()
            this.sendSignalUserChanged({ reaction : localUser.isReaction() });
        }
        this.setState({localUser: localUser});
    }

    detectMic(){
        this.state.session.on('publisherStartSpeacking', (event) => {
            console.log('나 얘기하는 중이잖아',event);
        })
        this.state.session.on('publisherStopSpeaking', (event) => {
            console.log('얘기 끝', event);
        })
    }


    render() {
        const mySessionId = this.state.mySessionId;
        const localUser = this.state.localUser;
        let camNumbers = 3;
        const hostUser = this.state.hostUser;

        return (
            <div>
                {localUser&&localUser.streamManager?(
                <div>
                    <div>
                        <ParticipantCams>
                            <DialogExtensionComponent showDialog={this.state.showExtensionDialog} cancelClicked={this.closeDialogExtension} />
                                {localUser !== undefined && !localUser.isAdmin() && localUser.getStreamManager() !== undefined && (
                                    <Cam>
                                        <StreamComponent user={localUser} handleNickname={this.nicknameChanged} />
                                    </Cam>
                                )}

                            {/* TODO: 창 줄이거나 채팅창 켜지면 사람 수 조절  */}
                            {/* TODO: 옆으로 넘어가는 케러셀 제작 */}
                            {/* TODO: 여기 로직 변경  */}
                            {this.state.subscribers.map((sub, i) => (
                                (i<=camNumbers)? (
                                <Cam key={i} >
                                    {console.log('구독자 정보',sub)}
                                    <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
                                </Cam>
                                ): null
                            ))}
                        </ParticipantCams>
                        {/* TODO: 호스트 캠, 스크린 스타일 조정 크기 조정 .. */}
                        <HostCam>
                            {hostUser !== undefined && hostUser.getStreamManager()!==undefined &&(
                                <div>
                                    <StreamComponent user={hostUser} />
                                </div>  
                            )}
                        </HostCam>
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
                            leaveSession={this.leaveSession}
                            handsUp={this.handsUp}
                        />
                    </Toolbar>
                </div>): (
                    // 비디오 안 불러왔으면 아무것도 안보이게 해놓음 
                    <div class="loading-container">
                        <div class="loading"></div>
                        <div id="loading-text">입장 중</div>
                    </div>
                )
                }
            </div>
        );
    }
    async getToken() {
        const response = await this.createSessionToken(this.state.mySessionId);
        return response.data;
    }

    async createSessionToken(sessionId){
        try{
            const response = await axios.post(APPLICATION_SERVER_URL + 'conference/join', { owner: this.state.isAdmin, uuid:sessionId },
            { headers: {
                'Content-Type': 'application/json',
                Authorization : `Bearer ${this.state.userToken}`
            }});
            return response.data;
        }catch(err){
            if(err.response.status===403){
                alert('없는 회의방입니다.')
                // 뒤로 보내기 
                window.history.back();
            }
            console.log(err);
        }
    }
}
export default VideoRoomComponent;
