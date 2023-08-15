import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../common/api/http-common';
// import { getToken } from '../../../common/api/JWT-common';
// import axios from 'axios';

// const token = getToken()
// createAsyncThunk를 이용한 비동기 처리
// 기록 data 가져오기.
export const getCodeData = createAsyncThunk('GET_CODE_DATA', async (data, { rejectWithValue }) => {
  console.log(DataTransferItemList);
  console.log(data.token,'하하하호호호');
  try {
    const response = await axios.get('/user/history/code', { 
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      },
    );
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기값 설정
const initialState = {
  course: {}
};

// 리덕스 슬라이스 생성
const pagesSlice = createSlice({
  name: 'pages',
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
        state.course = actions.payload[0].courses[0];

        console.log('나 저장 잘 했엉 ',state.course);
      })
      .addCase(getCodeData.rejected, (state)=>{
        state.course = null;
      });
    }
});

export const { resetCodeData, setCourse } = pagesSlice.actions;
export default pagesSlice.reducer;
