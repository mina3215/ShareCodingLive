import React from 'react';
import { List, ListItem, ListItemText, Paper } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

import './question.css'

const QuestionTab = (props) => {
  const fetchMoreData = () => {
    // Your logic to fetch more data goes here
  };

  return (
    <div>
      <div>질문탭 컨텐츠</div>
      {console.log("질문탭")}
      <Paper elevation={3} style={{ maxHeight: 400, overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={props.messages.length}
          next={fetchMoreData}
          hasMore={true} // You should implement your own logic to determine if there's more data to load
          // loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv" // Provide the ID of the scrollable div
        >
          <List>
            {props.messages.map((message, index) => (
              message.type === 'QUESTION' ? 
              <ListItem key={index} className="message-list-item">
                <div className="message-header">
                  {/* sender : 보낸 사람   time : 보낸 시간 */}
                  <p className="sender">{message.sender}</p>
                  <p className="message-time">{message.time}</p>
                </div>
                
                {/* message : 메시지 본문 */}
                <ListItemText primary={message.message} />
              </ListItem>
              : null
            ))}
          </List>
          </InfiniteScroll>
      </Paper>

    </div>

  )
  
}

export default QuestionTab;