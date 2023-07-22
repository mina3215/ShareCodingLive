package com.codragon.sclive.controller;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.UserReqDto;
import com.codragon.sclive.dto.UserResDto;
import com.codragon.sclive.jwt.Jwt;
import com.codragon.sclive.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    private Jwt jwt;
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation(value = "회원가입", notes = "email, nickname, password")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserReqDto userReqDto){ //role,, security???
        System.out.println(userReqDto.toString());
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.signup(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "로그인", notes = "email : 로그인 할 이메일\npassword : 로그인 할 비밀번호")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserReqDto userReqDto, HttpServletResponse response){
        ResponseEntity responseEntity = userService.login(userReqDto,response);
        return responseEntity;
    }

    //로그아웃

    @ApiOperation(value = "비밀번호 변경", notes = "<strong>비밀번호</strong>를 변경한다.")
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

    @ApiOperation(value = "닉네임 수정", notes = "{AccessToken, nickname}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "닉네임 변경 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/update")
    public ResponseEntity<String> updateUserInfo(@RequestParam String nickname, @RequestHeader("AccessToken")String accessToken){
        //if(jwt.validateToken(accessToken)){
            UserDao userDao = new UserDao();
            userDao.setNickname(nickname);
            userDao.setEmail(jwt.getEmailFromToken(accessToken));
            userService.updateUserInfo(userDao);
            return ResponseEntity.status(200).body("성공");
        //} else{
//            return ResponseEntity.status(401).body("닉네임 변경 실패");
        //}
    }

    @ApiOperation(value = "이메일 중복 검사", notes = "email : 중복 검사하고 싶은 이메일\n" +
            "이메일이 중복인 경우 0, 아니면 1")

    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/emailcheck")
    public ResponseEntity<Integer> emailCheck(@RequestParam String email){
        int sameEmailCnt = userService.emailCheck(email);
        int result = sameEmailCnt==0?1:0;
        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "닉네임 중복 검사", notes = "nickname : 중복 검사하고 싶은 닉네임\n" +
            "이메일이 중복인 경우 0, 아니면 1")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/nickcheck")
    public ResponseEntity<Integer> nicknameCheck(@RequestParam String nickname){
        int sameNicknameCnt = userService.nickNameCheck(nickname);
        int result = sameNicknameCnt==0?1:0;
        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "회원 탈퇴", notes = "(Header) Authorization : access 토큰")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/withdrawal")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String accessToken){
        int isDeleted = userService.deleteUser(accessToken);
        if (isDeleted == 1) {
            return ResponseEntity.status(200).body("Success");
        }
        return ResponseEntity.status(500).body("ERROR");
    }

    @ApiOperation(value = "회원 정보 조회", notes = "header에 access 토큰이 존재해야 한다.\n" +
            "")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "회원 정보 조회 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/userinfo")
    public ResponseEntity<UserResDto> getUserInfo(@RequestHeader("AccessToken")String accessToken){
//        if(jwt.validateToken(accessToken)){
            String email = jwt.getEmailFromToken(accessToken);
            UserDao userDao = userService.getUserInfo(email);
            UserResDto userResDto = userDao.getUserdaoToDto();
            return ResponseEntity.status(200).body(userResDto);
//        } else{
//            return ResponseEntity.status(401).body(null);
//        }
    }
}
