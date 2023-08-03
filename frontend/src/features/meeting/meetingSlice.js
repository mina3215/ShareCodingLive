import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteToken } from '../../common/api/JWT-common';
import axios from '../../common/api/http-common';

// 초기값 설정
const initialState = {
  user: {},
  isLoading: false,
};

// 리덕스 슬라이스 생성
const authSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
  },

});

// export const { setNicknameCheckedFalse, setEmailCheckedFalse, resetUser } = authSlice.actions;
export default authSlice.reducer;
