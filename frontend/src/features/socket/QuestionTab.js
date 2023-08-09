import React from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// import './question.css'

// import styled from 'styled-components';

const ChatContainer = styled(Paper)(({ theme }) => ({
  // width: '300px',
  // height: '400px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const ChatList = styled(List)({
  padding: '0',
  listStyleType: 'none',
  margin: '0',
  maxHeight: '100%',
  overflowY: 'scroll',
});

const ChatItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid #ccc',
  padding: '10px',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const AuthorText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  marginBottom: '5px',
  marginRight: '7px'
}));


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