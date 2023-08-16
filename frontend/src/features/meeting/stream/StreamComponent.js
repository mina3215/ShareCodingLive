import React, { Component } from 'react';
import OvVideoComponent from './OvVideo';

// 아이콘
import BackHandIcon from '@mui/icons-material/BackHand';

import styled from 'styled-components';

const CamOff = styled.div`
  position: relative;
  z-index: 9999;
`;

const Name = styled.div`
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

const Reaction = styled.div`
  z-index: 9999;
  display: flex;
  justify-content: end;
  align-items: end;
  color: yellow;
  & svg {
    width: 50px;
    height: 50px;
  }
`;

const HandDiv = styled.div`
  position: absolute;
`;

export default class StreamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: this.props.user.getNickname(), showForm: false, mutedSound: false, isFormValid: true };
    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.toggleNicknameForm = this.toggleNicknameForm.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
    // this.inputRef = React.createRef();
  }

  // componentDidMount() {
  //   this.props.handleChildRef(this.inputRef);
  //   console.log(this.inputRef, 'ref');
  // }

  handleChange(event) {
    this.setState({ nickname: event.target.value });
    event.preventDefault();
  }

  toggleNicknameForm() {
    if (this.props.user.isLocal()) {
      this.setState({ showForm: !this.state.showForm });
    }
  }

  toggleSound() {
    this.setState({ mutedSound: !this.state.mutedSound });
  }

  handlePressKey(event) {
    if (event.key === 'Enter') {
      console.log(this.state.nickname);
      if (this.state.nickname.length >= 3 && this.state.nickname.length <= 20) {
        this.props.handleNickname(this.state.nickname);
        this.toggleNicknameForm();
        this.setState({ isFormValid: true });
      } else {
        this.setState({ isFormValid: false });
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.user && this.props.user.getStreamManager() ? (
          <CamOff>
            {!this.props.user.isVideoActive() ? <Name>{this.props.user.getNickname()}</Name> : null}
            <HandDiv>
              <Reaction style={{ color: '#ffb500' }}>
                {!this.props.user.isHost() && this.props.user.isReaction() === 'hand' ? <BackHandIcon /> : null}
              </Reaction>
            </HandDiv>
            <div>
              {/* <div ref={(ref) => this.props.handleChildRef(ref)}> */}
              <OvVideoComponent cam={this.props.cam} user={this.props.user} mutedSound={this.state.mutedSound} handsUp={this.props.handsUp}/>
            </div>
          </CamOff>
        ) : null}
      </div>
    );
  }
}
