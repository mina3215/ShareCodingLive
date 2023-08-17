import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Button, makeStyles } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getToken } from '../../common/api/JWT-common';
import { getUUIDLink } from '../meeting/meetingSlice';
import { setReservationFalse } from './pagesSlice/pagesSlice';

import { toast } from 'react-toastify';

// import axios from 'axios';
import axios from '../../common/api/http-common';

// 복사 이모티콘
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Wrapper = styled(Container)`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const CreateRoomContainer = styled.div`
  height: 100vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// 날짜 입력 필드

export const CommonTextValidator = styled(TextValidator)`
  opacity: 0.8;
  width: 100%;
  height: 50px;
  font-size: 10px;
  font-color: #262626;
  padding: 1em 0 1em 0;
  border: red;

  // & label {
  //   color: black;
  //   font-weight: bold;
  // }

  & .MuiOutlinedInput-input {
    // border-radius: 6px;
    background-color: #ffffff;
    // padding: 0.6em;
    // border: 1px solid #dddddd;
  }

  // & .MuiOutlinedInput-notchedOutline {
  //   opacity: 0;
  // }
  margin-bottom: ${(props) => (props.islogininput ? '15px' : '0')};
`;

const useStyles = makeStyles({
  validatorForm: {
    width: '90%',
  },
  button: {
    background: 'linear-gradient(45deg, #ff859f 30%, #ffa87a 70%)',
    borderRadius: 7,
    border: 0,
    fontWeight: 'bold',
    color: 'white',
    height: 40,
    marginTop: '10px',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 70%)',
    },
  },
});

export const CommonButton = styled(Button)`
  width: 50%;
  border-radius: 6px;
  margin: 1em 0em 0em 0em;
  padding: 0.4em 1em;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.green ? '#3C6EBF' : '#D9D9D9')},
    ${(props) => (props.green ? '#3F3998' : '#D9D9D9')}
  );
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${(props) => (props.green ? '#9a95ee' : '#a1a1a1')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

const NewConference = (props) => {
  const classes = useStyles();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getToken();

  // 날짜 디폴트 값 오늘 날짜, 시간
  const dateNow = new Date();
  const currentTime = 'T' + dateNow.toTimeString().slice(0, 5);
  const today = dateNow.toISOString().slice(0, 10);
  const now = today + currentTime;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(now);
  const [uuid, setUUID] = useState(null);
  const [link, setLink] = useState(null);

  const [reserved, setReserved] = useState(false);

  // 방 생성 양식 제출 : uuid, link 저장
  function handleSubmit(e) {
    const data = {
      token: token,
      title: title,
    };
    dispatch(getUUIDLink(data))
      .unwrap()
      .then((res) => {
        console.log(res);
        setUUID(res.data.uuid);
        setLink(res.data.link);
      })
      .catch((err) => console.log(err));
  }

  // 방 예약 양식 제출 :
  function reserHandleSubmit(e) {
    console.log(date, '날짜');
    axios({
      method: 'post',
      url: 'reservation/create',
      data: { title: title, reservationTime: date },
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        // 예약 하고 나서 모달 창 끄기 해야 함.
        setReserved(!reserved);
        setUUID('reserved');
        setLink('reserved');
        dispatch(setReservationFalse());
      })
      .catch((err) => {
        if (err.status === 403) {
          toast.error('예약되었습니다.');
        }
      });
  }

  // 시작 -> uuid, isAdmin 값을 라우팅과 함께 전달
  function goTomeetingPage() {
    Navigate(`/meeting/${uuid}`, {
      state: {
        isHost: true,
      },
    });
  }

  // 링크 복사하는 함수
  const handleCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  return (
    <Wrapper>
      <CreateRoomContainer>
        {!(uuid && link) ? (
          <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
            {/* 제목 입력 필드 */}
            <CommonTextValidator
              islogininput="true"
              size="small"
              type="title"
              label="제목을 입력하세요"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              value={title}
              validators={['required']}
              errorMessages={['회의 제목을 입력하세요']}
              variant="outlined"
            />
            {/* 날짜 입력 필드 */}
            <CommonTextValidator
              size="small"
              label=""
              onChange={(e) => {
                setDate(e.target.value);
              }}
              inputProps={{ min: now }}
              value={date}
              validators={['required']}
              name="date"
              type="datetime-local"
              variant="outlined"
            />
            <CommonButton green="true" type="submit">
              생성
            </CommonButton>
            <br />

            <CommonButton grey="true" onClick={reserHandleSubmit}>
              예약
            </CommonButton>
          </ValidatorForm>
        ) : !reserved ? (
          <div>
            {/* 복사 버튼 */}
            <ContentCopyIcon
              size="small"
              variant="outlined"
              onClick={() => handleCopy(link)}
              style={{

                top: '12px',
                right: '12px',
                padding: '2px',
                marginLeft: '520px',
                minWidth: '5px', // 원하는 크기로 조절
                minHeight: '5px',
              }}
            />
            <h3>{link}</h3>
            
            <CommonButton green="true" onClick={goTomeetingPage}>
              시작
            </CommonButton>
          </div>
        ) : (
          <div>
            <h3>회의가 예약 되었습니다.</h3>
          </div>
        )}
      </CreateRoomContainer>
    </Wrapper>
  );
};

export default NewConference;
