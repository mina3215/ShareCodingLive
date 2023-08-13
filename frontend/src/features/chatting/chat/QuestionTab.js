import React from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// import './question.css'

// import styled from 'styled-components';

const ChatContainer = styled(Paper)(({ theme }) => ({
  // width: '300px',
  // height: '400px',
  // border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
  backgroundColor: '#c3d6f2',
}));

const ChatList = styled(List)({
  padding: '0',
  listStyleType: 'none',
  margin: '0',
  maxHeight: '100%',
  // overflowY: 'scroll',
});

const ChatItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid #ccc',
  padding: '10px',
  '&:last-child': {
    borderBottom: 'none',
  },
  overflowX: 'auto',
}));

const AuthorText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  marginRight: '7px',
  paddingRight: '10px',
  fontWeight: 'bold',
  borderRight: '1px solid #303030',
}));

// export const MessageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin: px 0;
// `;

// export const MessageContent = styled.div`
//   display: flex;
//   align-items: center;
// `;

// export const Sender = styled.p`
//   color: #d9d9d9;
//   margin-bottom: 10px;
//   margin-left: 5px;
// `;

// export const Message = styled.p`
//   color: #242424;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 10px;
// `;

// export const Time = styled.p`
//   color: #d9d9d9;
//   margin-left: 10px;
//   // margin-top: 50px;
//   margin-bottom: 0;
//   // margin-right: 100px;
// `;

// export const CustomMessages = styled.div`
//   background-color: #d9d9d9;
//   border-radius: 5px;
//   // padding-top: 10px;
//   // padding-bottom: 10px;
//   // padding-left: 10px;
//   // padding-right: 10px;
//   margin-left: 8px;
//   width: 100%;
// `;

// export const SenderIcon = styled.div`
//   margin-top: 20px;
//   margin-right: 10px;
//   background-color: #d9d9d9;
//   border-radius: 50%;
//   width: 50px;
//   height: 50px;
//   color: #242424;
//   text-align: center;
//   font-weight: bold;
//   font-size: 30px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
// `;

// export const ListContainer = styled.ul`
//   padding: 15px;
// `;

// export const MessageContainerWithIcon = styled.div`
//   display: flex;
// `;

const QuestionTab = (props) => {
  const fetchMoreData = () => {
    // Your logic to fetch more data goes here
  };
  return (
    <div>
      {/* <Box display="flex" justifyContent="center" alignItems="center" height="100vh"> */}
      <ChatContainer elevation={3}>
        <ChatList>
          {props.messages.map((message, index) =>
            message.type === 'QUESTION' ? (
              <ChatItem key={index}>
                <AuthorText>{message.sender}</AuthorText>
                <ListItemText primary={message.message} />
              </ChatItem>
            ) : null
          )}
        </ChatList>
      </ChatContainer>
      {/* </Box> */}
    </div>
  );
};

export default QuestionTab;
