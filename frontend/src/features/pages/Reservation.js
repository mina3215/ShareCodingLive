import React, { useState, useEffect } from 'react';

import { getToken } from '../../common/api/JWT-common';


import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import { Container, Button, makeStyles } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
// import axios from 'axios'
import axios from '../../common/api/http-common';

// 여기부터는 예약 리스트 보여주는 css

const ChatContainer = styled(Paper)(({ theme }) => ({
  // width: '300px',
  height: '350px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const ChatList = styled(List)({
  padding: '0',
  listStyleType: 'none',
  margin: '0',
  maxHeight: '100%',
  overflowY: 'scroll',
});

const ChatItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid #ccc',
  padding: '10px',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const AuthorText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  marginBottom: '5px',
  marginRight: '7px'
}));

// 여기부터는 예약 수정 모달 관련 css

const Wrapper = styled(Container)`
  display: flex;
  height: 55vh;
  justify-content: center;
  align-items: center;
`;

const CreateRoomContainer = styled.div`
  height: 900vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TextTitle = styled.label`
  font-size: 30px;
  color: #262626;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-top: 5vh
`;

const TextSubtitle = styled.label`
  font-size: 15px;
  color: #262626;
  padding: 1.5em 0;
  display: block;
  text-align: center;
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
    ${(props) => (props.green ? '#3C6EBF' : '#FF0000')},
    ${(props) => (props.green ? '#3F3998' : '#FF0000')}
  );
  color: ${(props) => (props.grey ? '#262626' : 'white')};
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${(props) => (props.green ? '#9a95ee' : '#EB9393')};
    color: ${(props) => (props.grey ? 'white' : '#262626')};
  }

  &:disabled {
    opacity: 0.35;
    color: ${(props) => (props.grey ? 'white' : 'black')};
  }
`;

const Reservation = () => {
  const classes = useStyles();

  // 날짜 디폴트 값 오늘 날짜, 시간
  const dateNow = new Date();
  const currentTime = 'T' + dateNow.toTimeString().slice(0, 5);
  const today = dateNow.toISOString().slice(0, 10);
  const now = today + currentTime;

  const [date, setDate] = useState(now);

  // 예약 리스트 담기
  const [reservations, setReservations] = useState([])

  // 각 예약 선택하면 true 값 주고, 수정이나 삭제 누르면 false 줘서 예약 리스트 보이고, 예약 수정 모달 보이게 하기
  const [resClicked, setResClicked] = useState(false)

  // 각 예약 클릭하면 set 해서 그 값들을 모달창에 띄울거임
  const [reservationTime, setReservationTime] = useState('')
  const [title, setTitle] = useState('')
  const [uuid, setUuid] = useState('')

  const [deleted, setDeleted] = useState(false)

  // 헤더에 넣게 토큰 받아오셈
  const token = getToken();

  // // 날짜 디폴트 값 오늘 날짜, 시간
  // const dateNow = new Date();
  // const currentTime = 'T' + dateNow.toTimeString().slice(0, 5);
  // const today = dateNow.toISOString().slice(0, 10);
  // const now = today + currentTime;

  // const [date, setDate] = useState(now);
  // 예약 페이지 열자마자 예약 리스트 조회
  useEffect(() => {
    // Scroll to the bottom when messages are updated
    getReservation();
  }, [title, reservationTime]);

  function handleSubmit(e) {

  }


  // 방 예약 조회 
  function getReservation(e) {
    axios({
      method: 'get',
      url: 'reservation/list',
      headers: {
        // 'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`, '' 붙이기, 액세스 토큰 이상했음!!!!
        'Authorization': `Bearer ${token}`,
        // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTIyNzUwMTgsImlhdCI6MTY5MjI3NTAxOCwiZW1haWwiOiJkZEBzc2FmeS5jb20iLCJuaWNrbmFtZSI6ImRkYW4ifQ.U918Eo5NC58Cj4ls28ZgBEvXaGDz7orhaXA1M03KzNA',
      }
    })
      .then((response) => {
          console.log(response);
          setReservations(response.data.data)
          console.log(reservations)
          console.log('클릭 여부: ' , resClicked)
      });
  }

  // 예약 수정 (수정하셈!!!)
  function changeReservation(e) {
    console.log("title : ", title)
    console.log("reservationTime : ", reservationTime)
    console.log("uuid : ", uuid)
    axios({
      method: 'post',
      url: 'reservation/update',
      data:{title:title, reservationTime:reservationTime, uuid:uuid},
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTIyNzUwMTgsImlhdCI6MTY5MjI3NTAxOCwiZW1haWwiOiJkZEBzc2FmeS5jb20iLCJuaWNrbmFtZSI6ImRkYW4ifQ.U918Eo5NC58Cj4ls28ZgBEvXaGDz7orhaXA1M03KzNA',
      }
    })
      .then((response) => {
          console.log(response.data.data);
          setResClicked(!resClicked)
          getReservation()

          // setReservations(response.data.data)
      });
  }

  // 예약 삭제(수정하셈!!!!) 
  function deleteReservation(e) {
    axios({
      method: 'delete',
      url: 'reservation/delete',
      params:{uuid:uuid},
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTIyNzUwMTgsImlhdCI6MTY5MjI3NTAxOCwiZW1haWwiOiJkZEBzc2FmeS5jb20iLCJuaWNrbmFtZSI6ImRkYW4ifQ.U918Eo5NC58Cj4ls28ZgBEvXaGDz7orhaXA1M03KzNA',
      }
    })
      .then((response) => {
          console.log(response);
          setResClicked(!resClicked)
          // setDeleted(!deleted)
          getReservation()
      });
  }

  // 예약리스트에서 항목 하나 선택하면 isClicked 바꿔주고, uuid, reservationTime, title set 하기
  const reserList = (reservation) => {
    console.log(reservation.uuid)
    setResClicked(!resClicked)
    setReservationTime(reservation.startTime)
    setTitle(reservation.title)
    setUuid(reservation.courseId)
  };

  function backToReserList() {
    setResClicked(!resClicked)
  }

  return (
    <div>
      {/* <button onClick={getReservation}>예약 조회</button>

      <ul>
      {reservations.map((reservation, index) =>
        <li key={index}>

          <div>
            {reservations.title}
            </div>
          
          <div>
            {reservations.startTime}
          </div> */}
          <TextTitle>예약 목록</TextTitle>
          <Wrapper>
            <CreateRoomContainer>
              
              {console.log(resClicked, 'clicked')}
              { resClicked ? (
                // <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
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
                      setReservationTime(e.target.value);
                    }}
                    // inputProps={{ min: reservationTime }}
                    value={ reservationTime }
                    validators={['required']}
                    name="date"
                    type="datetime-local"
                    variant="outlined"
                  />
                  <CommonButton green="true" onClick={changeReservation}>
                    예약 수정
                  </CommonButton>
                  {/* <br /> */}
                  <CommonButton red="true" onClick={deleteReservation}>예약 삭제</CommonButton>
                  <CommonButton green="true" onClick={backToReserList}>뒤로가기</CommonButton>
                </ValidatorForm>
              ) : (
                <div>
                  {/* 이거는 그냥 전체 예약 리스트들 보여주는거 */}
                  <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
                    <ChatContainer elevation={3}>
                    <ChatList>
                      {reservations.map((reservation, index) => 
                        // reservation.startTime >= date ? 
                        <ChatItem key={index} onClick={()=>reserList(reservation)}>
                          <ListItemText primary={reservation.title} />
                          <AuthorText>{reservation.startTime}</AuthorText>
                        </ChatItem>
                        // : null
                      )}
                    </ChatList>
                  </ChatContainer>
                  
                </Box>
              </div>
              )}
            </CreateRoomContainer>
          </Wrapper>


    </div>
    
  )
  ;
};
export default Reservation;
