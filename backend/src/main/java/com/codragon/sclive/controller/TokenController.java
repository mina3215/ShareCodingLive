package com.codragon.sclive.controller;


import com.codragon.sclive.exception.CustomException;
import com.codragon.sclive.service.TokenService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Api(value = "토큰 API", tags = {"Token"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
@Slf4j
public class TokenController {
    private final TokenService tokenService;

    @ApiOperation(value = "access 토큰 검증", notes = "(Header) Authorization : access 토큰")
    @ApiResponses({
            @ApiResponse(code = 200, message = "유효하고 만료되지 않은 토큰"),
            @ApiResponse(code = 400, message = "검증하지 못한 에러 (서버 관리자에게 알려주세요)"),
            @ApiResponse(code = 401, message = "유효하지 않은 토큰"),
            @ApiResponse(code = 406, message = "만료된 토큰"),
            @ApiResponse(code = 500, message = "서버 오류 (서버 관리자에게 알려주세요)")
    })
    @PostMapping("/validate/access")
    public ResponseEntity<String> getAccessValidation (@RequestHeader("Authorization") String accessToken) {
        try {
            Boolean isValid = tokenService.getValidation(accessToken);
            if (isValid) {
                return ResponseEntity.status(200).body("VALID");
            }
        } catch (CustomException e) {
            throw e;
        }
        return ResponseEntity.status(500).body("ERROR");
    }

    @ApiOperation(value = "refresh 토큰 검증", notes = "(쿠키) refreshToken : refresh 토큰 값")
    @ApiResponses({
            @ApiResponse(code = 200, message = "유효하고 만료되지 않은 토큰"),
            @ApiResponse(code = 401, message = "유효하지 않은 토큰"),
            @ApiResponse(code = 406, message = "만료된 토큰"),
            @ApiResponse(code = 500, message = "서버 오류 (서버 관리자에게 알려주세요)")
    }) //TODO: jwt 예외 좀 더 작업하고 swagger 고치기

    @PostMapping("/validate/refresh")
    public ResponseEntity<String> getRefreshValidation (@CookieValue(value = "refreshToken") String refreshToken) {
        try {
            Boolean isValid = tokenService.getValidation(refreshToken);
            if (isValid) {
                return ResponseEntity.status(200).body("VALID");
            }
        } catch (CustomException e) {
            throw e;
        }
        return ResponseEntity.status(500).body("ERROR");
    }
}
