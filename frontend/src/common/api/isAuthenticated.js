import { getToken } from './JWT-common';

const isAuthenticated = () => !!getToken(); // 로컬 스토리지에서 엑세스 토큰을 가져와 존재여부에 따라 true || false

export default isAuthenticated;
