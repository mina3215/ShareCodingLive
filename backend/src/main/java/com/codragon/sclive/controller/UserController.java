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
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation(value = "회원가입", notes = "{email password nickname}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/signup")
    public ResponseEntity<String> signup(UserReqDto userReqDto){
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.signup(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "로그인", notes = "{email password}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(UserReqDto userReqDto, HttpServletResponse response){
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
    public ResponseEntity<String> updatePassword(UserReqDto userReqDto) { //Auth와 password
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.updatePassword(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "회원정보 수정", notes = "{nickname, email}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/userinfo")
    public ResponseEntity<String> updateUserInfo(UserReqDto userReqDto){
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.updateUserInfo(userDao);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "이메일 중복 검사", notes = "{email}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/emailcheck")
    public ResponseEntity<String> emailCheck(@RequestParam String email){
        boolean isNotDuplicated = userService.emailCheck(email);
        if(isNotDuplicated){
            return ResponseEntity.status(200).body("bad");
        } else{
            return ResponseEntity.status(200).body("good");
        }
    }

    @ApiOperation(value = "닉네임 중복 검사", notes = "{nickname}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/nickcheck")
    public ResponseEntity<String> nicknameCheck(@RequestParam String nickname){
        boolean isNotDuplicated = userService.nickNameCheck(nickname);
        if(isNotDuplicated){
            return ResponseEntity.status(200).body("bad");
        } else{
            return ResponseEntity.status(200).body("good");
        }
    }

    @ApiOperation(value = "회원 탈퇴", notes = "")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/withdrawal")
    public ResponseEntity<String> updateUserInfo(){
        //auth에서 email 추출
        String email = "hello@gmail.com";
        userService.deleteUser(email);
        return ResponseEntity.status(200).body("Success");
    }

    @ApiOperation(value = "회원 정보 조회", notes = "")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/userinfo")
    public ResponseEntity<UserResDto> getUserInfo(){
        //auth에서 email 추출
        String email = "hello@gmail.com";
        UserDao userDao = userService.getUserInfo(email);
        UserResDto userResDto = userDao.getUserdaoToDto();
        return ResponseEntity.status(200).body(userResDto);
    }
}
