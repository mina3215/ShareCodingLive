import React from 'react';
import styled from 'styled-components';

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
  justify-content: flex-start;
  flex-direction: row;
  border: 3px solid red;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

const MemberNameDiv = styled.div`
  color: #d9d9d9;
  font-size: 20px;
  margin-left: 10px;
  font-weight: bold;
`;

// 손 든 사람들. 여기에 하이라이트 주시면 됩니다
const HandMember = (props) => {
  return (
    <div>
      {/* <div>손 든 참가자 컨텐츠</div> */}
      {/* {console.log("채팅탭 컨텐츠: ", props)} */}
      {/* {console.log("채팅탭")} */}
      <ul className="list-group">
        {console.log(props.members)}
        {props.handmembers.map((member, index) => (
          <MemberList key={index}>
            <SenderIcon>{member[0]}</SenderIcon>
            <MemberNameDiv>{member}</MemberNameDiv>
          </MemberList>
        ))}
      </ul>
    </div>
  );
};

export default HandMember;
