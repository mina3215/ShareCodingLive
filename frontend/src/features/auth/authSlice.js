import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteToken } from '../../common/api/JWT-common';
import { deleteNickname } from '../../common/api/JWT-common';
import axios from '../../common/api/http-common';

// createAsyncThunk를 이용한 비동기 처리
// 회원가입
export const signup = createAsyncThunk('SIGNUP', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await axios.post('/user/signup', userInfo);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 로그인
export const login = createAsyncThunk('LOGIN', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await axios.post('/user/login', userInfo);
    // console.log(response.data);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 로그아웃
export const logout = createAsyncThunk('LOGOUT', async (arg, { rejectWithValue }) => {
  try {
    deleteToken();
    deleteNickname();
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 회원탈퇴
export const deleteUser = createAsyncThunk('DELETE_USER', async (arg, { rejectWithValue }) => {
  try {
    const response = await axios.delete('/user/withdrawal');
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 닉네임 중복 검사
export const checkNickname = createAsyncThunk('CHECK_NICKNAME', async (nickname, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/user/nickcheck?nickname=${nickname}`);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 이메일 중복 검사
export const checkEmail = createAsyncThunk('CHECK_EMAIL', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/user/emailcheck?email=${email}`);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 유저정보 확인
export const checkUserInfo = createAsyncThunk('CHECK_USER_INFO', async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get('/user/userinfo', {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    console.log(response);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 닉네임 변경
export const modifyNickname = createAsyncThunk('MODIFY_NICKNAME', async (nickData, { rejectWithValue }) => {
  try {
    console.log(nickData.newNickname);
    const response = await axios.get('/user/update', {
      headers: {
        Authorization: `Bearer ${nickData.token}`,
      },
      params: { nickname: nickData.newNickname },
    });
    console.log(response, '반환값');
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 비밀번호 변경
export const modifyPassword = createAsyncThunk('MODIFY_PASSWORD', async (passData, { rejectWithValue }) => {
  try {
    console.log(passData.fixedPassword, 'DATA');
    const response = await axios.post(
      '/user/password',
      { changedPassword: passData.fixedPassword, password: passData.newPassword },
      {
        headers: {
          Authorization: `Bearer ${passData.token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (err) {
    return rejectWithValue(err.response);
  }
});

// 초기값 설정
const initialState = {
  user: {},
  isNicknameChecked: false,
  isEmailChecked: false,
  isLoading: false,
};

// 리덕스 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNicknameCheckedFalse: (state) => {
      state.isNicknameChecked = false;
    },
    setEmailCheckedFalse: (state) => {
      state.isEmailChecked = false;
    },
    resetUser: (state) => {
      state.user = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(checkNickname.fulfilled, (state) => {
        console.log('fulfilled');
        state.isNicknameChecked = true;
      })
      .addCase(checkNickname.rejected, (state) => {
        console.log('rejected');
        state.isNicknameChecked = false;
      })
      .addCase(checkEmail.fulfilled, (state) => {
        console.log('fulfilled');
        state.isEmailChecked = true;
      })
      .addCase(checkEmail.rejected, (state) => {
        console.log('rejected');
        state.isEmailChecked = false;
      })
      .addCase(modifyNickname.fulfilled, (state) => {
        state.isNicknameChecked = false;
      });
  },
});

export const { setNicknameCheckedFalse, setEmailCheckedFalse, resetUser } = authSlice.actions;
export default authSlice.reducer;
