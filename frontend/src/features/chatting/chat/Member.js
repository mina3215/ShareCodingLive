import React from 'react';
import styled from 'styled-components';
import remote from '../../../assets/remote_access.png';

export const SenderIcon = styled.div`
  // margin-top: 20px;
  margin-right: 10px;
  background-color: #d9d9d9;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  color: #242424;
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MemberList = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  // border: 1px solid red;
  padding: 10px;
`;

const MemberNameDiv = styled.div`
  color: #d9d9d9;
  font-size: 20px;
  margin-left: 10px;
  font-weight: bold;
`;

const CustomImg = styled.img`
  width: 60px;
  height: 60px;
  margin: auto;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// 손 안든 나머지 참가자들
const Member = (props) => {
  const openNewWindow = () => {
    window.open('http://192.168.100.210:3000/', '_blank');
  };
  return (
    <div>
      {/* <div>전체 참가자 컨텐츠</div> */}
      {/* {console.log("채팅탭 컨텐츠: ", props)} */}
      {/* {console.log("채팅탭")} */}
      <ul className="list-group">
        {console.log(props.members)}
        {props.members.map((member, index) => (
          <MemberList key={index}>
            <NameContainer>
              <SenderIcon>{member[0]}</SenderIcon>
              <MemberNameDiv>{member}</MemberNameDiv>
            </NameContainer>
            <button onClick={openNewWindow}>
              <CustomImg src={remote} alt="remote" />
            </button>
          </MemberList>
        ))}
      </ul>
    </div>
  );
};

export default Member;
