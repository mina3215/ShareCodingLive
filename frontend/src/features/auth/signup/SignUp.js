import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core';
import { toast } from 'react-toastify';
import { signup, checkNickname, setNicknameCheckedFalse, setEmailCheckedFalse, checkEmail } from '../authSlice';
import { CommonButton, CommonTextValidator } from '../login/Login';
// import logo from '../../../assets/logo.png';

// style
const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  flex: 0.4;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 400px;
  height: 100px;
`;

const SignUpContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const DupliCheckButton = styled(CommonButton)`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const EmailTextValidator = styled(CommonTextValidator)`
  margin-bottom: 15px;
`;

const useStyles = makeStyles({
  validatorForm: {
    width: '80%',
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

export default function SignUp(props) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const { isEmailChecked, isNicknameChecked, isLoading } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isValidInputNickname, setIsValidInputNickname] = useState(false);
  const [isValidInputEmail, setIsValidInputEmail] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toLoginHandler = () => {
    props.ToLogin(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (isNicknameChecked || !nickname) {
        setIsValidInputNickname(true);
      } else {
        setIsValidInputNickname(false);
      }
    }, 10);
  }, [nickname, isNicknameChecked]);

  useEffect(() => {
    setTimeout(() => {
      if (isEmailChecked || !email) {
        setIsValidInputEmail(true);
      } else {
        setIsValidInputEmail(false);
      }
    }, 10);
  }, [email, isEmailChecked]);

  // 유효성 검사 ( 비밀번호 일치 여부 )
  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== password) {
        return false;
      }
      return true;
    });
  }, [repeatPassword]);

  // 닉네임 유효성 검사
  function handleNickname(event) {
    const { value } = event.target;
    if (isNicknameChecked) {
      dispatch(setNicknameCheckedFalse());
    }
    if (value.length < 11) {
      setNickname(value.replace(/\s/g, ''));
      return true;
    }
    return false;
  }

  // 비밀번호 유효성 검사
  function handlePassword(event) {
    const { value } = event.target;
    if (value.length <= 16) {
      setPassword(value.replace(/\s/g, ''));
      return true;
    }
    return false;
  }

  // 이메일 유효성 검사
  function handleEmail(event) {
    const { value } = event.target;
    if (isEmailChecked) {
      dispatch(setEmailCheckedFalse());
    }
    setEmail(value);
  }

  function handleRepeatPassword(event) {
    const { value } = event.target;
    if (value.length <= 16) {
      setRepeatPassword(value.replace(/\s/g, ''));
      return true;
    }
    return false;
  }

  function isValidNickname() {
    dispatch(checkNickname(nickname))
      .unwrap()
      .then(() => {
        toast.success(`사용할 수 있는 닉네임입니다`);
        // console.log(isNicknameChecked);
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error("입력한 정보를 확인해주세요 (닉네임에는 'ㅣ' 사용이 불가합니다)");
        } else if (err.status === 403) {
          toast.error('중복된 닉네임이 존재합니다.');
          // console.log(isNicknameChecked);
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }

  function isValidEmail() {
    dispatch(checkEmail(email))
      .unwrap()
      .then(() => {
        toast.success(`사용할 수 있는 이메일입니다`);
        // console.log(isEmailChecked);
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error("입력한 정보를 확인해주세요 (이메일에는 'ㅣ' 사용이 불가합니다)");
        } else if (err.status === 403) {
          toast.error('중복된 이메일이 존재합니다.');
          // console.log(isEmailChecked);
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }

  // submit when user click button
  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      email,
      nickname,
      password,
    };
    dispatch(signup(data))
      .unwrap()
      .then(() => {
        toast.success('회원가입에 성공했습니다');
        toLoginHandler();
      })
      .catch((err) => {
        if (err.status === 500) {
          navigate('/error');
        }
      });
  }

  return (
    <Wrapper>
      {/* <LogoWrapper>
        <Logo src={logo} />
      </LogoWrapper> */}
      <SignUpContainer>
        <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
          {/* 닉네임 입력 필드 */}
          <CommonTextValidator
            height="50px"
            label="닉네임(최대10글자)"
            onChange={handleNickname}
            name="nickname"
            value={nickname}
            validators={['required', 'matchRegexp:^[a-zA-Z0-9ㄱ-힣_]+$']}
            errorMessages={['필수 입력 사항입니다.', '한글,영문,숫자, 특수문자_만 입력해주세요']}
            variant="outlined"
            size="small"
          />
          <DupliCheckButton grey="true" disabled={isValidInputNickname} onClick={isValidNickname}>
            중복확인
          </DupliCheckButton>
          {/* 이메일 입력 필드 */}
          <EmailTextValidator
            label="이메일"
            onChange={handleEmail}
            name="email"
            value={email}
            validators={['required', 'isEmail']}
            errorMessages={['필수 입력 사항입니다.', '유효하지 않은 이메일 형식입니다']}
            variant="outlined"
            size="small"
          />
          <DupliCheckButton grey="true" disabled={isValidInputEmail} onClick={isValidEmail}>
            중복확인
          </DupliCheckButton>
          {/* 비밀번호 입력 필드 */}
          <CommonTextValidator
            label="비밀번호"
            onChange={handlePassword}
            name="password"
            type="password"
            value={password}
            validators={['required', 'matchRegexp:^[A-Za-z0-9]{8,16}$']}
            errorMessages={['필수 입력 사항입니다.', '영어, 숫자를 조합해주세요 (8~16자)']}
            variant="outlined"
            size="small"
          />
          {/* 비밀번호 확인 입력 필드 */}
          <CommonTextValidator
            label="비밀번호 확인"
            onChange={handleRepeatPassword}
            type="password"
            name="repeatPassword"
            value={repeatPassword}
            validators={['isPasswordMatch', 'required']}
            errorMessages={['비밀번호가 일치하지 않습니다', '정보를 입력해주세요']}
            variant="outlined"
            margin="normal"
            size="small"
          />
          <CommonButton green="true" type="submit" disabled={isLoading}>
            {isLoading ? '회원가입중입니다' : '회원가입'}
          </CommonButton>
          <Link to="/">
            <CommonButton disabled={isLoading} onClick={toLoginHandler} grey="true">
              로그인 이동
            </CommonButton>
          </Link>
        </ValidatorForm>
      </SignUpContainer>
    </Wrapper>
  );
}
