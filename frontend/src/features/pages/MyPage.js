import styled from 'styled-components';
import { Container, Button } from '@material-ui/core';
import { propTypes } from 'react-bootstrap/esm/Image';

export const CommonButton = styled(Button)`
  width: 50%;
  border-radius: 6px;
  margin: 1em 0em 0em 0em;
  padding: 0.4em 1em;
  background: ${(props) => {
    if (props.darkgrey) {
      return '#2D2F42';
    } else if (props.grey) {
      return '#d9d9d9';
    }
  }};
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  &:hover {
    background: ${(props) => {
      if (props.green) {
        return '#4e5171';
      } else if (props.darkgrey) {
        return '#4e5171';
      } else if (props.grey) {
        return '#959595';
      }
    }};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

export const GradCommonButton = styled(Button)`
  width: 50%;
  border-radius: 6px;
  margin: 1em 0em 0em 0em;
  padding: 0.4em 1em;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.green ? '#3C6EBF' : '#D9D9D9')},
    ${(props) => (props.green ? '#410471' : '#D9D9D9')}
  );
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  &:hover {
    background: ${(props) => (props.green ? '#6889be' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

const Wrapper = styled(Container)`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
const MyPageContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TextTitle = styled.label`
  font-size: 30px;
  color: #262626;
  font-weight: bold;
  display: block;
  text-align: center;
`;

const TextSubtitle = styled.label`
  font-size: 15px;
  color: #262626;
  padding: 1.5em 0;
  display: block;
  text-align: center;
`;

const MyPage = (props) => {
  const toReservation = () => {
    props.ToMyPage(false);
    props.ToUserInfo(false);
    props.ToHistory(false);
  };
  const toUserInfo = () => {
    props.ToUserInfo(true);
    props.ToMyPage(false);
    props.ToHistory(false);
  };
  const toLectureRecord = () => {
    props.ToHistory(true);
    props.ToMyPage(false);
    props.ToUserInfo(false);

  };
  return (
    <Wrapper>
      <MyPageContainer>
        <TextTitle>마이페이지</TextTitle>
        <br />
        <TextSubtitle>CODESHARELIVE</TextSubtitle>
        <br />
        <GradCommonButton green="true" onClick={toUserInfo}>
          회원정보
        </GradCommonButton>
        <CommonButton darkgrey="true" onClick={toLectureRecord}>
          강의기록
        </CommonButton>
        <CommonButton grey="true" onClick={toReservation}>
          예약페이지로
        </CommonButton>
      </MyPageContainer>
    </Wrapper>
  );
};

export default MyPage;
