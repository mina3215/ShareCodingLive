import React, { Component } from 'react';

export default class OvVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.decideHeight = this.decideHeight.bind(this);
  }

  componentDidMount() {
    console.log('사용자 상태 확인', this.props.user);
    if (this.props && this.props.user.streamManager && !!this.videoRef) {
      console.log('PROPS: ', this.props);
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }

    if (this.props && this.props.user.streamManager.session && this.props.user && !!this.videoRef) {
      this.props.user.streamManager.session.on('signal:userChanged', (event) => {
        const data = JSON.parse(event.data);
        if (data.isScreenShareActive !== undefined) {
          this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
        }
      });
    }
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }
  }

  decideHeight() {
    if (this.props.user.isHost()) {
      if (this.props.cam) {
        return '56vh';
      } else {
        return '88vh';
      }
    }
    return '26vh';
  }

  render() {
    return (
      <video
        autoPlay={true}
        id={'video-' + this.props.user.getStreamManager().stream.streamId}
        ref={this.videoRef}
        muted={this.props.mutedSound}
        style={{ height: this.decideHeight() }}
      />
    );
  }
}
