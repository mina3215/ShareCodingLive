package com.codragon.sclive.controller;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.UserReqDto;
import com.codragon.sclive.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    //회원가입

    //로그인

    //로그아웃

    @ApiOperation(value = "비밀번호 변경", notes = "<strong>비밀번호</strong>를 변경한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/password")
    public ResponseEntity<String> updatePassword(UserReqDto userReqDto) { //Auth와 password

        UserDao userDao = userReqDto.UserDtoToDao();
        userService.updatePassword(userDao);

        return ResponseEntity.status(200).body("Success");
    }

    @GetMapping("/userinfo")
    public ResponseEntity<String> updateUserInfo(UserReqDto userReqDto){
        UserDao userDao = userReqDto.UserDtoToDao();
        userService.updateUserInfo(userDao);
        return ResponseEntity.status(200).body("Success");
    }

}
