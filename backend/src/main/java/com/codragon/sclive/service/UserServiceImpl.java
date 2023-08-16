package com.codragon.sclive.service;

import com.codragon.sclive.chat.CodeService;
import com.codragon.sclive.dao.Course;
import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dao.UserHistoryCourse;
import com.codragon.sclive.dao.UserUpdatePWDao;
import com.codragon.sclive.domain.Code;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.TokenDto;
import com.codragon.sclive.exception.CustomDBException;
import com.codragon.sclive.exception.DBErrorCode;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.mapper.ConferenceHistoryMapper;
import com.codragon.sclive.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    // JWT 관련
    private final Jwt jwt;
    private final JWTUtil jwtUtil;

    // Security 관련
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Redis Code 관련
    private final CodeService codeService;

    // Mapper
    private final UserMapper userMapper;
    private final ConferenceHistoryMapper conferenceHistoryMapper;

    @Override
    public TokenDto login(UserDao userDao) {

        boolean isLoginSuccessful = true;
        Authentication authenticatedUser = null;
        TokenDto tokenDto = new TokenDto();

        String email = userDao.getEmail();
        String password = userDao.getPassword();

        try {
            authenticatedUser = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException e) {
            // TODO: 추후에 예외 처리 하기!
            isLoginSuccessful = false;
            tokenDto.setLoginSuccessful(isLoginSuccessful);
            log.error("아이디 혹인 비밀번호가 틀립니다.");
        }

        if (isLoginSuccessful) {

            UserEntity loginUser = (UserEntity) authenticatedUser.getPrincipal();
            String nickname = loginUser.getUserNickname();

            String accessToken = jwt.createAccessToken(email, nickname);
            String refreshToken = jwt.createRefreshToken(email, nickname);

            log.debug("로그인 성공");
            log.debug("user: {}", loginUser);
            log.debug("Access-Token: {}", accessToken);
            log.debug("Refresh-Token: {}", refreshToken);

            tokenDto.setLoginSuccessful(true);
            tokenDto.setACCESS_TOKEN(accessToken);
            tokenDto.setREFRESH_TOKEN(refreshToken);
            tokenDto.setNickname(loginUser.getUserNickname());

            // redis에 RefreshToken 저장
            jwtUtil.saveUserRefreshToken(userDao.getEmail(), refreshToken);
        }

        return tokenDto;
    }

    @Override
    public int updatePassword(UserUpdatePWDao user) {
        //비밀번호 일치 확인
        boolean isSamePW = passwordEncoder.matches(user.getBeforePW(), user.getPassword());
        if (isSamePW) {
            String encodedPW = passwordEncoder.encode(user.getAfterPW());
            user.setPassword(encodedPW);
            userMapper.updatePassword(user);
            return 1;
        } else {
            return 0;
        }
    }

    @Override
    public void updateUserInfo(UserDao userDao) {
        userMapper.updateUserInfo(userDao);
    }

    @Override
    public void signup(UserDao userDao) {
        String encodedPW = passwordEncoder.encode(userDao.getPassword());
        userDao.setPassword(encodedPW);
        log.info(userDao.toString());
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
    public void deleteUser(String email) {

        jwtUtil.deleteUserRefreshToken(email);

        // 이미 탈퇴한 회원이라면
        UserDao mysqlInfo = this.getUserInfoByEmail(email);
        if (mysqlInfo == null) {
            throw new CustomDBException(DBErrorCode.ALREADY_DELETED);
        }
        userMapper.deleteUser(email);
    }

    @Override
    public UserDao getUserInfoByEmail(String email) {
        UserDao userDao = userMapper.getUserByEmail(email);
        return userDao;
    }

    @Override
    public List<UserHistoryCourse> getCodeHistoryFromCourses(String userEmail) {

        List<UserHistoryCourse> userHistoryCourses
                = conferenceHistoryMapper.getUserConferenceHistory(userEmail);

        for (UserHistoryCourse userHistoryCourse : userHistoryCourses) {

            List<Course> courses = userHistoryCourse.getCourses();
            for (Course course : courses) {

                String courseUUID = course.getCourseUUID();
                Map<String, Code> allCode = codeService.getAllCode(courseUUID);
                ArrayList<Code> codes = new ArrayList<>(allCode.values());

                course.setCodes(codes);
            }
        }

        return userHistoryCourses;
    }
}
