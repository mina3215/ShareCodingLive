import React from 'react';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import './members.css'; // 스타일 시트를 불러옴

// 손 든 사람들. 여기에 하이라이트 주시면 됩니다
const HandMember = (props) => {
  return (
    <div>

        <Container maxWidth="md" className="container">
          <Typography variant="h5" className="title">
            참가자 목록
          </Typography>
          <List className="participant-list">
            {props.handmembers.map((member, index) => (
              <ListItem key={index} className="participant-item">
                <ListItemText primary={member} className="participant-name" />
              </ListItem>
            ))}
          </List>
        </Container>
      {/* <div>손 든 참가자 컨텐츠</div>
      {console.log("채팅탭 컨텐츠: ", props)}
      {console.log("채팅탭")}
      <ul className="list-group">
        {console.log(props.members)}
        {props.handmembers.map((member, index) => (
          <li key={index}>{member}</li>)
      )}
      </ul> */}
    </div>
    
  )
  
}

export default HandMember;