import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';
import { deleteToken } from '../../../common/api/JWT-common';
import { CommonButton, CommonTextValidator } from '../login/Login';
import { checkNickname, modifyNickname, setNicknameCheckedFalse } from '../authSlice';
import { getToken } from '../../../common/api/JWT-common';
import { saveNickname } from '../../../common/api/JWT-common';

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

const ChangeButton = styled(CommonButton)`
  margin-bottom: 30px;
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

export default function ModifyUserNickName(props) {
  const [newNickname, setNickname] = useState('');
  const isNicknameChecked = useSelector((state) => state.auth.isNicknameChecked);
  const [isValidInputNickname, setIsValidInputNickname] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  // 입력 닉네임 유효성 설정
  useEffect(() => {
    setTimeout(() => {
      if (isNicknameChecked || !newNickname) {
        setIsValidInputNickname(true);
      } else {
        setIsValidInputNickname(false);
      }
    }, 10);
  }, [newNickname, isNicknameChecked]);

  function handleNickname(event) {
    const { value } = event.target;
    if (isNicknameChecked) {
      dispatch(setNicknameCheckedFalse());
    }
    if (value.length < 11) {
      setNickname(value.trim());
      return true;
    }
    return false;
  }

  function doCheckNickname() {
    if (newNickname) {
      dispatch(checkNickname(newNickname))
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
  }

  // 닉네임 최대 글자수 제한 조건 추가
  useEffect(() => {
    ValidatorForm.addValidationRule('maxNumber', (value) => {
      if (value.length > 11) {
        return false;
      }
      return true;
    });
  }, [newNickname]);

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      token,
      newNickname,
    };
    dispatch(modifyNickname(data))
      .unwrap()
      .then(() => {
        // props.ToMypage(true);
        saveNickname(newNickname);
        props.ToUserInfo(false);
        props.modNick(false);
        toast.success('😀 닉네임 변경이 완료되었습니다');
        props.nickTouch(true);
      })
      .catch((err) => {
        if (err.status === 400) {
          toast.error('😀 입력한 정보를 다시 확인해주세요');
        } else if (err.status === 401) {
          toast.error('😥 로그인을 다시 해주세요!');
          deleteToken();
          navigate('/login');
        } else if (err.status === 409) {
          toast.error('😀 이미 존재하는 닉네임입니다');
        } else if (err.status === 404) {
          toast.error('😥 로그인을 다시 해주세요');
          deleteToken();
          navigate('/login');
        } else if (err.status === 500) {
          navigate('/error');
        }
      });
  }
  return (
    <Wrapper>
      <ModifyContainer>
        <ValidatorForm onSubmit={handleSubmit} className={classes.validatorForm}>
          {/* 닉네임 입력 필드 */}
          <CommonTextValidator
            height="50px"
            label="닉네임"
            onChange={handleNickname}
            name="nickname"
            value={newNickname}
            validators={['required', 'matchRegexp:^[a-zA-Z0-9ㄱ-힣_]+$', 'maxNumber']}
            errorMessages={['필수 입력 사항입니다.', '한글,영문,숫자, 특수문자_만 입력해주세요', '최대 10글자 입니다']}
            variant="outlined"
            // margin="normal"
            size="small"
            // fullWidth
          />
          <CommonButton
            green="true"
            onClick={doCheckNickname}
            disabled={isNicknameChecked || !newNickname || isValidInputNickname}
          >
            중복확인
          </CommonButton>
          <ChangeButton grey="true" type="submit" disabled={!isNicknameChecked}>
            변경하기
          </ChangeButton>
        </ValidatorForm>
      </ModifyContainer>
    </Wrapper>
  );
}
