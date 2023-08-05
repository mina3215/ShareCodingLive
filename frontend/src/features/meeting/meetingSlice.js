import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteToken } from '../../common/api/JWT-common';
import axios from '../../common/api/http-common';


// 액션들
// export const signup = createAsyncThunk('SIGNUP', async (userInfo, { rejectWithValue }) => {
//   try {
//     const response = await axios.post('/user/signup', userInfo);
//     return response;
//   } catch (err) {
//     return rejectWithValue(err.response);
//   }
// });
// 초기값 설정
const initialState = {
  user: {},
  isLoading: false,
  hands : false,
};

// 리덕스 슬라이스 생성
const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    userHandsUp: (state) => {
      state.hands = true;
      alert('손듦',state.hands);


      setTimeout(() => {
        state.hands = false;
      }, 5000);
    },
  },

});

// export const { setNicknameCheckedFalse, setEmailCheckedFalse, resetUser } = authSlice.actions;
const {actions, reducer} = meetingSlice;

export const {userHandsUp} = actions;

export default reducer;
