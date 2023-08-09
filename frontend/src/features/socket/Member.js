import React from 'react';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import './members.css'; // 스타일 시트를 불러옴

// 손 안든 나머지 참가자들
const Member = (props) => {
  return (
    <div>
      <Container maxWidth="md" className="container">
        <Typography variant="h5" className="title">
          참가자 목록
        </Typography>
        <List className="participant-list">
          {props.members.map((member, index) => (
            <ListItem key={index} className="participant-item">
              <ListItemText primary={member} className="participant-name" />
            </ListItem>
          ))}
        </List>
      </Container>
      {/* <div>전체 참가자 컨텐츠</div>
      {console.log("채팅탭 컨텐츠: ", props)}
      {console.log("채팅탭")}
      <ul className="list-group">
        {console.log(props.members)}
        {props.members.map((member, index) => (
          <li key={index}>{member}</li>)
      )}
      </ul> */}
    </div>
    
  )
  
}

export default Member;