import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Button, makeStyles } from '@material-ui/core';
import { deleteToken } from '../../../common/api/JWT-common';
import { CommonTextValidator } from '../login/Login';
import { getToken } from '../../../common/api/JWT-common';
import { modifyPassword } from '../authSlice';

// style
const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ModifyContainer = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const CommonButton = styled(Button)`
  // width: 50%;
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

export default function ModifyPassword(props) {
  const [newPassword, setPassword] = useState('');
  const [isPasswordSame, setIsPasswordSame] = useState(false);
  const [fixedPassword, setfixedPassword] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  // 수정 버튼 클릭 시 폼 제출
  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      token,
      newPassword,
      fixedPassword,
    };
    dispatch(modifyPassword(data))
      .unwrap()
      .then(() => {
        deleteToken();
        props.ToUserInfo(false);
        props.ToMypage(false);
        props.ChangeLogin(false);
        props.modPassword(false);
        toast.success('비밀번호 수정이 완료되었습니다. 다시 로그인해주세요');
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error('입력 정보를 확인해주세요');
        } else if (err.status === 401) {
          toast.error('다시 로그인해주세요');
          deleteToken();
          props.modPassword(false);
        } else if (err.status === 404) {
          toast.error('다시 로그인해주세요');
          deleteToken();
          props.modPassword(false);
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }

  // 유효성 검사 ( 동일한 비밀번호 여부 )
  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== newPassword) {
        setIsPasswordSame(true);
        return true;
      }
      setIsPasswordSame(false);
      return false;
    });
  }, [fixedPassword]);

  function handlePassword(event) {
    const { value } = event.target;
    if (value.length <= 16) {
      setPassword(value.replace(/\s/g, ''));
      return true;
    }
    return false;
  }

  return (
    <Wrapper>
      {/* <LogoWrapper>
        <Logo
          src={logo}
          onClick={() => {
            navigate('/');
          }}
        />
      </LogoWrapper> */}

      <ModifyContainer>
        <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm} name="password">
          {/* 기존 비밀번호 입력 필드 */}
          <CommonTextValidator
            label="기존비밀번호"
            onChange={handlePassword}
            name="password"
            type="password"
            value={newPassword}
            validators={['required', 'matchRegexp:^[A-Za-z0-9]{8,16}$']}
            errorMessages={['필수 입력 사항입니다.', '영어, 숫자를 조합해주세요 (8~16자)']}
            variant="outlined"
            size="small"
          />
          {/* 새로운 비밀번호 입력 필드 */}
          <CommonTextValidator
            label="새로운 비밀번호"
            onChange={(e) => setfixedPassword(e.target.value)}
            type="password"
            name="fixedPassword"
            value={fixedPassword}
            validators={['isPasswordMatch', 'required']}
            errorMessages={['비밀번호가 같습니다', '비밀번호를 입력해주세요']}
            variant="outlined"
            margin="normal"
            size="small"
            fullWidth
          />
          <CommonButton disabled={!newPassword || !isPasswordSame} green="true" type="submit">
            비밀번호 변경하기
          </CommonButton>
        </ValidatorForm>
      </ModifyContainer>
    </Wrapper>
  );
}
