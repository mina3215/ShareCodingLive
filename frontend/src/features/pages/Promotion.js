import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Moment from 'react-moment';
import { useInterval } from 'use-interval';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'moment/locale/ko';

import night from '../../assets/night.jpg';
import midnight from '../../assets/midnight.jpg';
import day from '../../assets/day.jpg';
import morning from '../../assets/morning.jpg';

const PromotionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 30vw;
  height: 65vh;
`;

const CustomCalendar = styled(Calendar)`
  width: 100%;
  border-radius: 10px;
  border: 3px solid #2d2f42;
  font-weight: bold;
  padding: 10px;
  & .react-calendar__tile {
    border-radius: 10px;
  }
  & .react-calendar__tile--active {
    background: linear-gradient(to bottom, #3c6ebf, #3f3998);
    color: white;
  }
  & .react-calendar__tile:enabled:hover {
    background: #4c5085;
  }
  & .react-calendar__tile:enabled:focus {
    background: linear-gradient(to bottom, #3c6ebf, #3f3998);
  }
  & .react-calendar__tile--now {
    background: linear-gradient(to bottom, #2d2f42, #4c5085);
    color: white;
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Box = styled(({ backgroundImage, isMorningOrDay, ...rest }) => <div {...rest} />)`
  padding: 20px;
  text-align: center;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3vh;
  width: 100%;
  height: 28vh;
  flex-direction: column;
  border-radius: 10px;

  ${(props) =>
    props.isMorningOrDay &&
    css`
      color: black;
      text-shadow: -1px 0px white;
    `}
`;

const TimeDiv = styled.div`
  font-size: 60px;
`;

const DateDiv = styled.div`
  font-size: 20px;
`;

const Promotion = () => {
  const [value, onChange] = useState(new Date());
  const [nowTime, setNowTime] = useState(Date.now());
  const [backgroundImage, setBackgroundImage] = useState(night);
  const [isMorningOrDay, setIsMorningOrDay] = useState(false);

  useEffect(() => {
    const hour = new Date(nowTime).getHours();
    if (hour >= 6 && hour < 12) {
      setBackgroundImage(morning);
      setIsMorningOrDay(true);
    } else if (hour >= 12 && hour < 18) {
      setBackgroundImage(day);
      setIsMorningOrDay(true);
    } else if (hour >= 18 && hour < 24) {
      setBackgroundImage(night);
      setIsMorningOrDay(false);
    } else {
      setBackgroundImage(midnight);
      setIsMorningOrDay(false);
    }
  }, [nowTime]);

  useInterval(() => {
    setNowTime(Date.now());
  }, 1000);

  return (
    <PromotionContainer>
      <Box backgroundImage={backgroundImage} isMorningOrDay={isMorningOrDay}>
        <TimeDiv>
          <Moment format="h:mm A">{nowTime}</Moment>
        </TimeDiv>
        <DateDiv>
          <Moment format="YYYY년 MM월 DD일">{nowTime}</Moment>
          <Moment format=" dddd" locale="ko">
            {nowTime}
          </Moment>
        </DateDiv>
      </Box>
      <CalendarContainer>
        <CustomCalendar onChange={onChange} value={value} />
        {/* <div className="text-gray-500 mt-4">{moment(value).format('YYYY년 MM월 DD일')}</div> */}
      </CalendarContainer>
    </PromotionContainer>
  );
};

export default Promotion;
