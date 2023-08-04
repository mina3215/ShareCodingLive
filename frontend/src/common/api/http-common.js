import baseAxios from 'axios';

// axios 객체 설정
const axios = baseAxios.create({
  baseURL: 'https://i9d109.p.ssafy.io:8094/', // 기본 URL
  headers: {
    'Content-Type': 'application/json', // 요청의 Content-Type 을 json으로 지정
  },
});

export default axios;
