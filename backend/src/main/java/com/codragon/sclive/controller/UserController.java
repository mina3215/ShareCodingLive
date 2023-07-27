package com.codragon.sclive.controller;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.*;
import com.codragon.sclive.exception.CustomDBException;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;


@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final Jwt jwt;
    private final JWTUtil jwtUtil;
    private final UserService userService;

    public UserController(Jwt jwt, JWTUtil jwtUtil, UserService userService) {
        this.jwt = jwt;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @ApiOperation(value = "회원가입", notes = "email, nickname, password")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserReqDto userReqDto) {
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.signup(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "로그인", notes = "email, password")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/login")
    public ResponseEntity<UserLoginResDto> login(@RequestBody UserLoginReqDto userLoginReqDto, HttpServletResponse response) {

        UserDao userDao = userLoginReqDto.UserDtoToDao();
        TokenDto tokenDto = userService.login(userDao);

        UserLoginResDto responseDto = null;

        // FIXME: 로그인 예외 처리 Refactoring 하기
        if (tokenDto.isLoginSuccessful()) {

            final String accessToken = tokenDto.getACCESS_TOKEN();
            final String refreshToken = tokenDto.getREFRESH_TOKEN();

            Cookie cookie = new Cookie("Refresh-Token", refreshToken);
            // TODO: application.yml 파일에서 RefreshToken 유효 기간 불러오기
            cookie.setMaxAge(60 * 60 * 24 * 3); // 3일
            cookie.setSecure(true);
            cookie.setHttpOnly(true);

            response.addHeader("Access-Token", accessToken);
            response.addCookie(cookie);

            responseDto = UserLoginResDto.builder()
                    .httpStatusCode(200)
                    .message("정상적으로 로그인이 완료됐습니다.")
                    .build();
        } else {
            responseDto = UserLoginResDto.builder()
                    .httpStatusCode(401)
                    .message("아이디 혹은 비밀번호가 잘못 됐습니다.")
                    .build();
        }

        return ResponseEntity.status(responseDto.getHttpStatusCode()).body(responseDto);
    }

    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public void logout(@AuthenticationPrincipal UserEntity user, HttpServletResponse response) {
        log.info("user: {}", user);

        Cookie myCookie = new Cookie("Refresh-Token", null);
        myCookie.setMaxAge(0);
        response.addCookie(myCookie);

        jwtUtil.deleteUserRefreshToken(user.getUserEmail());
    }

    @ApiOperation(value = "비밀번호 변경", notes = "password") //Todo : 비밀번호 변경 로직 구현
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/password")
    public ResponseEntity<String> updatePassword(@RequestBody UserReqDto userReqDto) { //Auth와 password
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.updatePassword(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "닉네임 수정", notes = "{nickname,\nAccessToken이 header에 존재해야 한다.}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "닉네임 변경 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/update")
    public ResponseEntity<String> updateUserInfo(
            @RequestParam String nickname,
            @RequestHeader("Authorization") String accessToken,
            @AuthenticationPrincipal UserEntity user) {

        log.info("user: {}", user);
        log.debug("nickname: {}", nickname);
        log.debug("accessToken: {}", accessToken);
        accessToken = jwt.removeBearer(accessToken);
//        UserDao userDao = new UserDao();
//        userDao.setNickname(nickname);
//        userDao.setEmail(jwt.getEmailFromToken(accessToken));
//        userService.updateUserInfo(userDao);
        return ResponseEntity.status(200).body("성공");
    }

    @ApiOperation(value = "이메일 중복 검사", notes = "email : 중복 검사하고 싶은 이메일\n" +
            "이메일이 중복인 경우 0, 아니면 1")

    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/emailcheck")
    public ResponseEntity<Integer> emailCheck(@RequestParam String email) {
        int sameEmailCnt = userService.emailCheck(email);
        int result = sameEmailCnt == 0 ? 1 : 0;
        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "닉네임 중복 검사", notes = "nickname : 중복 검사하고 싶은 닉네임\n" +
            "이메일이 중복인 경우 0, 아니면 1")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/nickcheck")
    public ResponseEntity<Integer> nicknameCheck(@RequestParam String nickname) {
        int sameNicknameCnt = userService.nickNameCheck(nickname);
        int result = sameNicknameCnt == 0 ? 1 : 0;
        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "회원 탈퇴", notes = "(Header) Authorization : access 토큰")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "이미 탈퇴한 회원"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/withdrawal")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String accessToken) {
        accessToken = jwt.removeBearer(accessToken);
        try {
            userService.deleteUser(accessToken);
            return ResponseEntity.status(200).body("SUCCESS");
        } catch (CustomDBException e) {
            throw e;
        }
    }

    @ApiOperation(value = "회원 정보 조회", notes = "header에 Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로\n"+
                                                "액세스토큰을 담아줘야 동작합니다! 토큰 앞에 Bearer 이거 ㅠㅣ")

    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "회원 정보 조회 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/userinfo")
    public ResponseEntity<UserResDto> getUserInfo(@RequestHeader("Authorization") String accessToken) {
        accessToken = jwt.removeBearer(accessToken);
        String email = jwt.getEmailFromToken(accessToken);
        UserDao userDao = userService.getUserInfoByEmail(email);
        UserResDto userResDto = userDao.getUserdaoToDto();
        return ResponseEntity.status(200).body(userResDto);
    }
}
