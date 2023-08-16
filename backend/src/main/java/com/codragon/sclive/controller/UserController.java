package com.codragon.sclive.controller;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dao.UserHistoryCourse;
import com.codragon.sclive.dao.UserUpdatePWDao;
import com.codragon.sclive.domain.HttpResult;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.List;


@Api(value = "유저 API", tags = {"User"})
@Slf4j
@RestController
@RequestMapping("/user")
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
    public ResponseEntity<HttpResult> signup(@RequestBody UserReqDto userReqDto) {
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.signup(userDao);
        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
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
            cookie.setPath("/");
//            cookie.setSecure(true);
//            cookie.setHttpOnly(true);

            response.addHeader("Access-Token", accessToken);
            response.addCookie(cookie);

            responseDto = UserLoginResDto.builder()
                    .httpStatusCode(200)
                    .message("정상적으로 로그인이 완료됐습니다.")
                    .nickname(tokenDto.getNickname())
                    .build();
        } else {
            responseDto = UserLoginResDto.builder()
                    .httpStatusCode(401)
                    .message("아이디 혹은 비밀번호가 잘못 됐습니다.")
                    .build();
        }

        return ResponseEntity.status(responseDto.getHttpStatusCode()).body(responseDto);
    }

    @ApiOperation(value = "로그아웃", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    @GetMapping("/logout")
    public ResponseEntity<HttpResult> logout(
            @ApiIgnore @AuthenticationPrincipal UserEntity user,
            HttpServletResponse response) {
        log.info("user: {}", user);

        Cookie myCookie = new Cookie("Refresh-Token", null);
        myCookie.setMaxAge(0);
        response.addCookie(myCookie);

        jwtUtil.deleteUserRefreshToken(user.getUserEmail());
        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "비밀번호 변경", notes = "password : 바꿀 비밀번호\n" + "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    //Todo : 비밀번호 변경 로직 구현
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/password")
    public ResponseEntity<HttpResult> updatePassword(
            @ApiIgnore @AuthenticationPrincipal UserEntity user,
            @RequestBody UserUpPWReqDto userUpPWReqDto) {
        log.info("user: {}", user);
        log.info("ReqDto: {}", userUpPWReqDto.toString());
        UserUpdatePWDao userUpdatePWDao = new UserUpdatePWDao();
        userUpdatePWDao.setEmail(user.getUserEmail());
        userUpdatePWDao.setPassword(user.getPassword());
        userUpdatePWDao.setBeforePW(userUpPWReqDto.getPassword());
        userUpdatePWDao.setAfterPW(userUpPWReqDto.getChangedPassword());
        log.info("Dao : {}", userUpdatePWDao.toString());
        int res = userService.updatePassword(userUpdatePWDao);
        HttpResult result = null;
        if(res==1){
            result = HttpResult.getSuccess();
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "비밀번호 변경에 실패했습니다.");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "닉네임 수정", notes = "nickname\n" + "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "닉네임 변경 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/update")
    public ResponseEntity<HttpResult> updateUserInfo(
            @ApiIgnore @AuthenticationPrincipal UserEntity user,
            @RequestParam String nickname) {
        log.info("user: {}", user);
        log.debug("nickname: {}", nickname);
        UserDao userDao = new UserDao();
        userDao.setNickname(nickname);
        userDao.setEmail(user.getUserEmail());
        userService.updateUserInfo(userDao);
        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "이메일 중복 검사", notes = "email : 중복 검사하고 싶은 이메일\n" +
            "이메일이 중복인 경우 0, 아니면 1")

    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/emailcheck")
    public ResponseEntity<HttpResult> emailCheck(@RequestParam String email) {
        int sameEmailCnt = userService.emailCheck(email);
        HttpResult result = null;
        if (sameEmailCnt == 0) {
            result = HttpResult.getSuccess();
        } else {
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "중복된 이메일 입니다.");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "닉네임 중복 검사", notes = "nickname : 중복 검사하고 싶은 닉네임\n" +
            "이메일이 중복인 경우 0, 아니면 1")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/nickcheck")
    public ResponseEntity<HttpResult> nicknameCheck(@RequestParam String nickname) {
        int sameNicknameCnt = userService.nickNameCheck(nickname);
        HttpResult result = null;
        if (sameNicknameCnt == 0) {
            result = HttpResult.getSuccess();
        } else {
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "중복된 닉네임 입니다.");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "회원 탈퇴", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "이미 탈퇴한 회원"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/withdrawal")
    public ResponseEntity<HttpResult> deleteUser(@ApiIgnore @AuthenticationPrincipal UserEntity user) {
        HttpResult result = null;
        try {
            userService.deleteUser(user.getUserEmail());
            result = HttpResult.getSuccess();
        } catch (CustomDBException e) {
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, e.getMessage());
        } finally {
            return ResponseEntity.status(result.getStatus()).body(result);
        }
    }

    @ApiOperation(value = "회원 정보 조회", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "회원 정보 조회 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/userinfo")
    public ResponseEntity<HttpResult> getUserInfo(@ApiIgnore @AuthenticationPrincipal UserEntity user) {
        String email = user.getUserEmail();
        UserDao userDao = userService.getUserInfoByEmail(email);
        UserResDto userResDto = userDao.getUserdaoToDto();
        HttpResult result = HttpResult.getSuccess();
        result.setData(userResDto);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "지난 회의 코드 조회", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "회원 정보 조회 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/history/code")
    public List<UserHistoryCourse> getCodeHistory(@ApiIgnore @AuthenticationPrincipal UserEntity user) {
        return userService.getCodeHistoryFromCourses(user.getUserEmail());
    }
}
