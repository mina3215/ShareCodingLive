import React from 'react';

const ChattingTab = (props) => {
  return (
    <div>
      <div>채팅탭 컨텐츠</div>
      {/* {console.log("채팅탭 컨텐츠: ", props)} */}
      {console.log("채팅탭")}
      <ul className="list-group">
        {props.messages.map((message, index) => (
          // (message.type === 'TALK' || message.type === 'ENTER') ?
          (message.type === 'TALK')?
          <div className="message" key={index}>
            {/* sender : 보낸사람 */}
            <p className="sender">{message.sender}</p>
            {/* time : 메시지 보낸 시간 */}
            <p className="message-time">{message.time}</p>
            {/* message : 메시지 본문 */}
            <p className="message-text">{message.message}</p>

          </div>
          // <li className="list-group-item" key={index}>
            
          // </li>
          : null
        ))}
      </ul>
    </div>
    
  )
  
}

export default ChattingTab;
