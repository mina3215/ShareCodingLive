import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../../common/api/http-common';
import axios from 'axios';

// createAsyncThunk를 이용한 비동기 처리
// 기록 data 가져오기.
export const getCodeData = createAsyncThunk('GET_CODE_DATA', async (userInfo, { rejectWithValue }) => {
  try {
    console.log(userInfo.token);
    const response = await axios.get('http://192.168.100.132:8080/user/history/code', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기값 설정
const initialState = {
  course: {
    title: 'C++ 수업',
    teacher: '테스트 유저',
    codes: [
      {
        title: '코드 제목',
        content: '코드 내용',
        created_time: 'Fri Aug 04 16:36:01 KST 2023',
        summarization: '코드 요약',
      },
    ],
  },
};

// 리덕스 슬라이스 생성
const pagesSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    resetCodeData: (state) => {
      state.course = [];
    },
    setCourse: (state, action) => {
      state.course = action.payload;
      console.log(state.course);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCodeData.fulfilled, (state, actions) => {
        state.course = actions.payload;
      })
      .addCase(getCodeData.rejected, (state) => {
        state.course = null;
      });
  },
});

export const { resetCodeData, setCourse } = pagesSlice.actions;
export default pagesSlice.reducer;
