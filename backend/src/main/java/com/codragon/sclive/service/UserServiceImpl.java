package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.UserReqDto;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

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
    public int deleteUser(String accessToken) {
        String email = jwt.getEmailFromToken(accessToken);
        int isDeleted = jwtUtil.deleteUserRefreshToken(email);
        userMapper.deleteUser(email);
        return isDeleted;
        // TODO:redis에러, mysql 삭제 트랜잭션 처리
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
            Jwt jwt = new Jwt();
            String accessToken = jwt.createAccessToken(userDao.getEmail(), userDao.getNickname());
            String refreshToken = jwt.createRefreshToken(userDao.getEmail(), userDao.getNickname());
            //토큰 발급
            response.addHeader("AccessToken", accessToken);
            Cookie cookie = new Cookie("RefreshToken", refreshToken);
            response.addCookie(cookie);
            //헤더에 포함
            //redis에 RefreshToken 저장
            return ResponseEntity.status(200).body("Success");
        } else{
            return ResponseEntity.status(200).body("Fail");
        }
    }
}
