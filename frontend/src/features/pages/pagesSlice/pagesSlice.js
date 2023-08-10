import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../../common/api/http-common';

// createAsyncThunk를 이용한 비동기 처리
// 기록 data 가져오기.
export const getCodeData = createAsyncThunk('GET_CODE_DATA', async (userInfo, { rejectWithValue }) => {
  try {
    // const response = await axios.get('/user/getCodeData', userInfo);
    // return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기값 설정
const initialState = {
  history: null,
  date: null,
  course: null,
};

// 리덕스 슬라이스 생성
const pagesSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    resetCodeData: (state) => {
      state.codes = [];   
    },
    setCourse: (state, action) => {
      state.course = action.payload;
      console.log(state.course);
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getCodeData.pending, (state) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(getCodeData.fulfilled, (state) => {
  //       state.isLoading = false;
  //     })
  //     .addCase(getCodeData.rejected, (state) => {
  //       state.isLoading = false;
  //     }
  // }
});

export const { resetCodeData, setCourse } = pagesSlice.actions;
export default pagesSlice.reducer;
