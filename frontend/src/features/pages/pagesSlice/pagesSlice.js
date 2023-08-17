import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../common/api/http-common';
// import { getToken } from '../../../common/api/JWT-common';
// import axios from 'axios';

// const token = getToken()
// createAsyncThunk를 이용한 비동기 처리
// 기록 data 가져오기.
export const getCodeData = createAsyncThunk('GET_CODE_DATA', async (data, { rejectWithValue }) => {
  console.log(DataTransferItemList);
  try {
    const response = await axios.get('user/history/code', { 
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      },
    );
    console.log(response)
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기값 설정
const initialState = {
  course: {},
  isLoadReservation: false,
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
    setReservationFalse: (state) => {
      state.isLoadReservation = !state.isLoadReservation;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCodeData.fulfilled, (state, actions) => {
        state.course = actions.payload[0] ? actions.payload[0].courses[0] : null;
      })
      .addCase(getCodeData.rejected, (state) => {
        state.course = null;
      });
  },
});

export const { resetCodeData, setCourse, setReservationFalse } = pagesSlice.actions;
export default pagesSlice.reducer;
