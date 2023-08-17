// import moment from 'moment';

export const saveToken = (token) => {
  window.localStorage.setItem('token', token); // 로컬 스토리지에 token 값 저장
};
// export const saveRefreshToken = (token) => {
//   window.localStorage.setItem('RefreshToken', token);
// };
export const getToken = () => {
  return window.localStorage.getItem('token'); // 로컬 스토리지에서 token 값 불러오기
};
export const deleteToken = () => {
  window.localStorage.removeItem('token'); // 로컬 스토리지에서 token 값 삭제
};

export const saveNickname = (nickname) => {
  window.localStorage.setItem('nick', nickname); // 로컬 스토리지에서 token 값 삭제
};

export const deleteNickname = () => {
  window.localStorage.removeItem('nick'); // 로컬 스토리지에서 token 값 삭제
};
// export const expireToken = () => {
//   window.localStorage.setItem('expiresAt', moment().add(20, 'second').format('yyyy-MM-DD HH:mm:ss'));
// };
