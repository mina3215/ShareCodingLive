package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.UserReqDto;
import com.codragon.sclive.exception.CustomDBException;
import com.codragon.sclive.exception.DBErrorCode;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final Jwt jwt;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, Jwt jwt, JWTUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.jwt = jwt;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void updatePassword(UserDao userDao) {
        String encodedPW = passwordEncoder.encode(userDao.getPassword());
        userDao.setPassword(encodedPW);
        userMapper.updatePassword(userDao);
    }

    @Override
    public void updateUserInfo(UserDao userDao) {
        userMapper.updateUserInfo(userDao);
    }

    @Override
    public void signup(UserDao userDao) {
        userMapper.signup(userDao);
    }

    @Override
    public int emailCheck(String email) {
        int emailCnt = userMapper.emailCheck(email);//같은 이메일을 가진 회원 목록 조회
        return emailCnt;
    }

    @Override
    public int nickNameCheck(String nickname) {
        int nicknameCnt = userMapper.nickNameCheck(nickname); //같은 닉네임을 가진 회원 목록 조회
        return nicknameCnt;
    }

    @Override
    public void deleteUser(String accessToken){
        String email = jwt.getEmailFromToken(accessToken);
        jwtUtil.deleteUserRefreshToken(email);

        // 이미 탈퇴한 회원이라면
        UserDao mysqlInfo = this.getUserInfo(email);
        if (mysqlInfo == null) {
            throw new CustomDBException(DBErrorCode.ALREADY_DELETED);
        }
        userMapper.deleteUser(email);
    }

    @Override
    public UserDao getUserInfo(String email) {
        UserDao userDao = userMapper.getUserInfo(email);
        return userDao;
    }

    @Override
    public ResponseEntity login(UserReqDto userReqDto, HttpServletResponse response) {
        String email = userReqDto.getEmail();
        String password = userReqDto.getPassword();
        UserDao userDao = this.getUserInfo(email);

        // 입력된 비번과 디비의 암호화된 비번이 같은지 확인.
        boolean passwordMatched = passwordEncoder.matches(password, userDao.getPassword());

        if(passwordMatched){ //유효한 패스워드이다.
            //토큰 발급
            Jwt jwt = new Jwt();
            String accessToken = jwt.createAccessToken(userDao.getEmail(), userDao.getNickname());
            String refreshToken = jwt.createRefreshToken(userDao.getEmail(), userDao.getNickname());

            //헤더에 포함
            response.addHeader("AccessToken", accessToken);
            Cookie cookie = new Cookie("RefreshToken", refreshToken);
            cookie.setMaxAge(60 * 60 * 24 * 3);
            response.addCookie(cookie);

            //redis에 RefreshToken 저장
            jwtUtil.saveUserRefreshToken(userDao.getEmail(), refreshToken);
            return ResponseEntity.status(200).body("Success");
        } else{
            return ResponseEntity.status(200).body("Fail");
        }
    }
}
