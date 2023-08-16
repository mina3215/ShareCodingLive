import React from 'react';
import styled from 'styled-components';

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`;

export const MessageContent = styled.div`
  display: flex;
  align-items: center;
`;

export const Sender = styled.p`
  color: #d9d9d9;
  margin-bottom: 10px;
  margin-left: 5px;
`;

export const Message = styled.p`
  color: #242424;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

export const Time = styled.p`
  color: #d9d9d9;
  margin-left: 10px;
  // margin-top: 50px;
  margin-bottom: 0;
  // margin-right: 100px;
`;

export const CustomMessages = styled.div`
  background-color: #d9d9d9;
  border-radius: 5px;
  // padding-top: 10px;
  // padding-bottom: 10px;
  // padding-left: 10px;
  // padding-right: 10px;
  margin-left: 8px;
  width: 100%;
`;

export const SenderIcon = styled.div`
  margin-top: 20px;
  margin-right: 10px;
  background-color: #d9d9d9;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #242424;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ListContainer = styled.ul`
  padding: 15px;
`;

export const MessageContainerWithIcon = styled.div`
  display: flex;
`;
const ChattingTab = (props) => {
  return (
    <div>
      <ListContainer className="list-group">
        {props.messages.map((message, index) =>
          message.type === 'TALK' ? (
            <div className="message" key={index}>
              <MessageContainerWithIcon>
                <SenderIcon>
                  <p className="sender">{message.sender[0]}</p>
                </SenderIcon>
                <MessageContainer>
                  {/* sender : 보낸사람 */}
                  <Sender className="sender">{message.sender}</Sender>
                  {/* <Sender className="sender">비단박</Sender> */}
                  <MessageContent>
                    <CustomMessages>
                      {/* message : 메시지 본문 */}
                      <Message className="message-text">{message.message}</Message>
                    </CustomMessages>
                    {/* time : 메시지 보낸 시간 */}
                    <Time className="message-time">{message.time}</Time>
                  </MessageContent>
                </MessageContainer>
              </MessageContainerWithIcon>
            </div>
          ) : null
        )}
      </ListContainer>
    </div>
  );
};

export default ChattingTab;
