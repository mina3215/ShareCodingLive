import { Fragment } from 'react';
import axios from '../../common/api/http-common';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import DialogExtensionComponent from './dialog-extension/DialogExtension';
import StreamComponent from './stream/StreamComponent';

import UserModel from './models/user-model';
import ToolbarComponent from './toolbar/ToolbarComponent';

import { getToken as getLocalToken } from '../../common/api/JWT-common';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// css
import styled from 'styled-components';
import './VideoRoomComponent.css';

const HostCam = styled.div`
  position: relative;
  display: flex;
  // width: 50%;
  height: 55%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  // top: 250px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  background-color: #161616;
  height: 50vh;
`;
const ContainerCam = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #161616;
  height: 50vh;
`;

const ParticipantCams = styled.div`
  // flex: 1;
  top: 0;
  display: flex;
  flex-wrap: unwrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #282828;
  width: 100%;
  height: 32vh;
  position: relative;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  background-color: #282828;
  position: relative;
  z-index: 9999;
`;

const Cam = styled.div`
  position: relative;
  // width: 290px;
  height: 40vh;
  align-items: center;
  overflow: hidden;
  // margin-top: 15px;
  margin-bottom: 1.5vh;
  margin-left: 15px;
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
  & div {
    // position: relative;
    // width: 320px;
    overflow: hidden;
  }
`;

const ParticipantCam = styled.div`
  overflow-y: hidden;
  display: flex;
  overflow-x: auto;
  gap: 12px; /* 참가자 화면 사이의 간격 설정 */
  max-width: 100%; /* 부모 컨테이너의 크기에 맞춤 */
  margin-bottom: 15px; /* 하단 여백 설정 */
  margin-top: 20px; /* 하단 여백 설정 */
  margin-left: 15px; /* 하단 여백 설정 */
  height: 28.5vh;
`;

const IndividualCam = styled.div`
  flex: 0 0 auto;
  width: 20vw; /* 참가자 화면의 너비 설정 */
  height: 28vh; /* 참가자 화면의 높이 설정 */
  overflow: hidden;
  // border: 1px solid #ccc;
`;

var localUser = new UserModel();
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';

class VideoRoomComponent extends Component {
  constructor(props) {
    super(props);
    this.hasBeenUpdated = false;
    const uuid = this.props.uuid;
    const isHost = this.props.isHost;
    // let userName = this.props.user ? this.props.user : 'OpenVidu_User' + Math.floor(Math.random() * 100);
    let userName = localStorage.getItem('nick');
    this.remotes = [];
    this.localUserAccessAllowed = false;
    const userToken = getLocalToken(); // 주소가 쉐코라랑 달라서 잠깐 보류

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
      isHost: isHost, // 나는 host 인가?
      isReact: false, // 손을 들었는가?
      userToken: userToken, // localStorage 토큰
      showCam: true,
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
    this.ParticipantCamShow = this.ParticipantCamShow.bind(this);
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

  ParticipantCamShow() {
    this.setState({ showCam: !this.state.showCam });
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      async () => {
        this.subscribeToStreamCreated(); // 참여자들의 정보를 불러온다.
        await this.connectToSession(); // 내 세션을 연결시킨다.
      }
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
        if (this.props.error) {
          this.props.error({ error: error.error, messgae: error.message, code: error.code, status: error.status });
        }
      }
    }
  }

  connect(token) {
    // 내 세션을 새로 연결시킨다. 이때 .connect는 OV.initSession()의 함수.
    // .connect()는 인자로 세션token, clientData, MetaData를 갖는다.
    this.state.session
      .connect(token, {
        clientData: this.state.myUserName,
        host: this.state.isHost,
      })
      .then(() => {
        // 세션에 성공하면 webcam연결
        this.connectWebCam();
      })
      .catch((error) => {
        if (this.props.error) {
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
    var videoDevices = devices.filter((device) => device.kind === 'videoinput');

    // 첫 publisher 생성.
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: this.state.isHost ? '1280x720' : '320x240',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false,
    });
    // 누가 세션 올린거 감지
    if (this.state.session.capabilities.publish) {
      publisher.on('accessAllowed', () => {
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
    localUser.setRole(this.state.isHost);
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
    if (localUser.isHost()) {
      this.setState({ hostUser: localUser });
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
      }
    );
  }

  async leaveSession() {
    const mySession = this.state.session;
    if (mySession) {
      mySession.disconnect();
    }
    // TODO: 호스트 나간거 알려주기
    // Empty all properties...
    this.OV = null;
    if (localUser.isHost() && this.state.mySessionId !== 'SessionA') {
      try {
        const response = await axios.get(`/conference/end?uuid=${this.state.mySessionId}`, {
          headers: {
            Authorization: `Bearer ${this.state.userToken}`,
          },
        });
      } catch (err) {
        console.log(err, '방종료 에러');
      }
    }
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'OpenVidu_User' + Math.floor(Math.random() * 100),
      localUser: undefined,
      isHost: false,
      isReact: false,
    });
    //  종료 로직 넣을거니까 건들지 않기.
    this.props.setIsExit(true);
  }

  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive());
    try {
      localUser.getStreamManager().publishVideo(localUser.isVideoActive());
      this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
      this.setState({ localUser: localUser });
    } catch (error) {
      alert('현재 사용할 수 있는 카메라가 없습니다. 잠시후 다시 시도하세요 ');
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
      newUser.setRole(JSON.parse(clientdata).host);
      newUser.setReaction(JSON.parse(clientdata).reaction);

      // 구독자 중 호스트가 있으면 hostUser에 넣습니다.
      if (newUser.isHost()) {
        this.setState({ hostUser: newUser });
        return;
      }
      // 아니면 그냥 구독자
      this.remotes.push(newUser);
      if (this.localUserAccessAllowed) {
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
          if (data.reaction !== undefined) {
            user.setReaction(data.reaction);
          }
        }
      });
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
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
    if (!this.state.localUser.isHost()) {
      alert('host가 아니면 화면공유를 할 수 없습니다.');
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
      }
    );

    publisher.once('accessAllowed', () => {
      // 현재 카메라, host 얼굴 캠 제거
      this.state.session.unpublish(localUser.getStreamManager());

      // 위에서 선언한 SCREEN publisher를 내 streamManager로 지정 ( 전역 localUser )
      localUser.setStreamManager(publisher);

      // 크롬에서 제공해주는 공유 중지 상단 바 눌렀을 때 종료하는 로직
      if (publisher.stream.getMediaStream()) {
        publisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
            this.state.session.unpublish(publisher);
            this.connectWebCam();
          });
      }

      // screen 화면을 공유함.
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        // 전역 localUser 변경
        localUser.setScreenShareActive(true);
        // state localUser에 전역 localUser의 상태를 지정, hostUser에도 지정
        this.setState({ localUser: localUser, hostUser: localUser }, () => {
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
    isScreenShared =
      this.state.subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive();
  }

  checkNotification(event) {
    this.setState({
      messageReceived: this.state.chatDisplay === 'none',
    });
  }

  // 손 들기 감지
  handsUp() {
    if (localUser.isReaction() === 'hand') {
      localUser.setReaction('none');
      this.sendSignalUserChanged({ reaction: localUser.isReaction() });
    } else {
      localUser.setReaction('hand');
      this.sendSignalUserChanged({ reaction: localUser.isReaction() });
    }
    this.setState({ localUser: localUser });
    this.props.handleHandUp();
  }

  detectMic() {
    this.state.session.on('publisherStartSpeacking', (event) => {
      console.log('나 얘기하는 중이잖아', event);
    });
    this.state.session.on('publisherStopSpeaking', (event) => {
      console.log('얘기 끝', event);
    });
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const localUser = this.state.localUser;
    let camNumbers = 3;
    const hostUser = this.state.hostUser;

    return (
      <Fragment>
        {localUser && localUser.streamManager ? (
          <div style={{ height: '100vh' }}>
            <DialogExtensionComponent
              showDialog={this.state.showExtensionDialog}
              cancelClicked={this.closeDialogExtension}
            />
            {/* <ContainerCam> */}
            {this.state.showCam && (
              <ParticipantCams>
                {localUser !== undefined && !localUser.isHost() && localUser.getStreamManager() !== undefined && (
                  <Cam>
                    <StreamComponent
                      cam={this.state.showCam}
                      user={localUser}
                      handleNickname={this.nicknameChanged}
                      handsUp={this.handsUp}
                    />
                  </Cam>
                )}

                {/* TODO: 창 줄이거나 채팅창 켜지면 사람 수 조절  */}
                {/* TODO: 옆으로 넘어가는 케러셀 제작 */}
                {/* TODO: 여기 로직 변경  */}
                <ParticipantCam>
                  {this.state.subscribers.map((sub, i) =>
                    i <= camNumbers ? (
                      <IndividualCam key={i}>
                        <StreamComponent
                          cam={this.state.showCam}
                          user={sub}
                          streamId={sub.streamManager.stream.streamId}
                        />
                      </IndividualCam>
                    ) : null
                  )}
                </ParticipantCam>
              </ParticipantCams>
            )}
            <div style={{ backgroundColor: '#242424', display: 'grid' }}>
              <button onClick={this.ParticipantCamShow}>
                <FontAwesomeIcon icon={faBars} style={{ color: 'white' }} />
              </button>
            </div>
            <div style={{ backgroundColor: '#161616' }}>
              <HostCam ref={(ref) => this.props.handleChildRef(ref)}>
                {hostUser !== undefined && hostUser.getStreamManager() !== undefined && (
                  <StreamComponent
                    // handleChildRef={this.props.handleChildRef}
                    cam={this.state.showCam}
                    user={hostUser}
                  />
                )}
              </HostCam>
            </div>
            {/* </ContainerCam> */}
            {/* TODO: 호스트 캠, 스크린 두기 */}
            {/* <Container> */}
            {/* <Toolbar> */}
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
              handleToggleChat={this.props.handleToggleChat}
              handleToggleMember={this.props.handleToggleMember}
              setCapture={this.props.setCapture}
            />
            {/* </Toolbar> */}
            {/* </Container> */}
          </div>
        ) : (
          // 비디오 안 불러왔으면 아무것도 안보이게 해놓음
          <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-text">입장 중</div>
          </div>
        )}
      </Fragment>
    );
  }
  async getToken() {
    const response = await this.createSessionToken(this.state.mySessionId);
    return response.data;
  }

  async createSessionToken(sessionId) {
    try {
      console.log('토큰', this.state.userToken);
      console.log('세션아이디', sessionId);
      const response = await axios.post(
        'conference/join/',
        { owner: this.state.isHost, uuid: sessionId },
        {
          headers: {
            Authorization: `Bearer ${this.state.userToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      if (err.response.status === 403) {
        alert('없는 회의방입니다.');
        // 뒤로 보내기
        window.history.back();
      }
      console.log(err);
    }
  }
}
export default VideoRoomComponent;
