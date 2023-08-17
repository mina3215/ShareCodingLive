import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Button, makeStyles } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled(Container)`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

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

const EnterConference = (props) => {
  const classes = useStyles();

  const [url, setURL] = useState('');

  const Navigate = useNavigate();

  function handleSubmit(e) {
    const len = url.length;
    const uuid = url.slice(len-36, len);
    console.log(uuid);
    console.log('넘길 uuid', uuid);
    Navigate(`/meeting/${uuid}`, {
      state: {
        isHost: false,
      },
    });
  }
  return (
    <Wrapper>
      <LoginContainer>
        <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
          <CommonTextValidator
            size="small"
            label="링크"
            onChange={(e) => {
              setURL(e.target.value.replace(/\s/g, ''));
            }}
            value={url}
            name="url"
            validators={['required']}
            errorMessages={['링크를 입력하세요!']}
            variant="outlined"
          />
          <CommonButton green="true" type="submit">
            회의 참여
          </CommonButton>
        </ValidatorForm>
      </LoginContainer>
    </Wrapper>
  );
};

export default EnterConference;
