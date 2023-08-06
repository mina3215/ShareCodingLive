import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 액션

export const getUUIDLink = createAsyncThunk('GET_UUID_LINK', async (data, { rejectWithValue }) => {
  try {
    console.log(data);
    console.log(data.title);
    const response = await axios.post(
      `http://119.56.161.229:7777/conference/create?title=${data.title}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기 값 
const initialState = {
  uuid: null,
  roomTitle : null,
  createTime : null,
  hands : false,
};

// 리덕스 슬라이스 생성
const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    userHandsUp: (state) => {
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUUIDLink.fulfilled, (state) => {
      console.log(state);
    })
    .addCase(getUUIDLink.rejected, (state)=>{
      console.log(state);
    })
  }

});

// export const { setNicknameCheckedFalse, setEmailCheckedFalse, resetUser } = authSlice.actions;

export default meetingSlice.reducer;
