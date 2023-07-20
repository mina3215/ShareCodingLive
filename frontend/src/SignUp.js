import React from 'react';
import axios from 'axios';


function SignUp(props) {
  
    return (
        <div>
          <ul>
            {/* 아이디 입력 */}
            <li> <label htmlFor="ID"> 아이디 </label>
                 <input id="ID" type="id" placeholder='아이디' />
            </li>
            {/* 비밀번호 입력 label htmlFor과 input id 맞추면 label 클릭 시 포커스*/}
            <li> <label htmlFor="password1"> 비밀번호 </label> 
                 <input id="password1" type="password1" placeholder='*********' />
            </li>
            {/* 추가 정보 하단 입력 받을 예정 */}
            <li> <label htmlFor="email"> 이메일 </label> 
                 <input id="email" type="email" placeholder='test@email.com' />
            </li>
            <li><input type="checkbox" /> (필수) 개인정보 수집 및 이용 동의 </li>
            <li><input type="checkbox" /> (선택) SMS 수신 동의 </li>
          </ul>

          {/* 버튼은 중복제출 처리를 방지해야한다. */}
          <button type='submit'> 등록하기 </button>

        </div>
    );
}

export default SignUp;