import React from 'react';

const Member = (props) => {
  return (
    <div>
      <div>참가자 컨텐츠</div>
      {/* {console.log("채팅탭 컨텐츠: ", props)} */}
      {/* {console.log("채팅탭")} */}
      <ul className="list-group">
        {console.log(props.members)}
        {props.members.map((member, index) => (
          <li key={index}>{member}</li>)
      )}
      </ul>
    </div>
    
  )
  
}

export default Member;