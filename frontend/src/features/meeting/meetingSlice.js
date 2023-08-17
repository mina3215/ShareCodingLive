import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../common/api/http-common';
// import axios from 'axios';

// 액션

// 방장이 방 생성 시 UUID, Link 받아오기
export const getUUIDLink = createAsyncThunk('GET_UUID_LINK', async (data, { rejectWithValue }) => {
  try {
    console.log(data);
    console.log(data.title);
    const response = await axios.post(
      `conference/create?title=${data.title}`,
      {},
      {
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

export const createRoom = createAsyncThunk('CREATE_ROOM', async (data, { rejectWithValue }) => {
  const params = new URLSearchParams();
  params.append('roomId', data.uuid);
  try {
    const response = await axios.post('/ws/chat', params);
    console.log(response.data);
  } catch (err) {
    console.log('에렁레어ㅔ러에러ㅔ어레어', err);
  }
});

// 초기 값
const initialState = {
  isRef: null,
};

// 리덕스 슬라이스 생성
const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    userHandsUp: (state) => {},
    setRef: (state, action) => {
      state.isRef = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUUIDLink.fulfilled, (state) => {
        console.log(state);
      })
      .addCase(getUUIDLink.rejected, (state) => {
        console.log(state);
      });
  },
});

export const { setRef } = meetingSlice.actions;

export default meetingSlice.reducer;
