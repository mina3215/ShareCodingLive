import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// style
import { StylesProvider } from '@material-ui/core/styles';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import GlobalStyles from './GlobalStyles';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// features
import Home from '../features/home/Home';
import Error404 from '../common/error/Error404';
import Error500 from '../common/error/Error500';
import MeetingPage from '../features/meeting/MeetingPage';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #2d2f42, #4c5085);
  background-color: #d9d9d9;
`;

// 팝업알림 스타일
const StyledToastContainer = styled(ToastContainer).attrs({})`
  .Toastify__toast--error {
    font-size: 0.8rem;
    line-height: 1.5;
    word-break: keep-all;
  }
  .Toastify__toast--success {
    background-color: rgba(106, 96, 169, 0.7);
    font-size: 0.8rem;
    line-height: 1.5;
    word-break: keep-all;
    & .Toastify__progress-bar--success {
    }
  }
`;

function App() {
  return (
    // 스타일 주입
    <StylesProvider injectFirst>
      <Wrapper>
        {/* 전역 스타일 설정 */}
        <GlobalStyles />
        {/* 라우팅 설정 */}
        <BrowserRouter>
          <Routes>
            <Route path="/error" element={<Error500 />} />
            <Route path="/" element={<Home />} />
            {/* 경로 매핑 되지 않을 시 404 오류 페이지 */}
            <Route path="*" element={<Error404 />} />
            {/* 음.. */}
            <Route path="/meeting/:uuid" element={<MeetingPage />} />
          </Routes>
        </BrowserRouter>
        <StyledToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />
      </Wrapper>
    </StylesProvider>
  );
}

export default App;
