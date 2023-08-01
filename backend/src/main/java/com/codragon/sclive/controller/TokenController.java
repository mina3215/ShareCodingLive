package com.codragon.sclive.controller;


import com.codragon.sclive.exception.CustomJWTException;
import com.codragon.sclive.exception.JWTErrorCode;
import com.codragon.sclive.service.TokenService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

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
            @ApiResponse(code = 401, message = "유효하지 않은 토큰"),
            @ApiResponse(code = 406, message = "만료된 토큰"),
            @ApiResponse(code = 500, message = "서버 오류 (서버 관리자에게 알려주세요)")
    })
    @PostMapping("/validate/access")
    public ResponseEntity<String> getAccessValidation (@RequestHeader("Authorization") String accessToken) {
        try {
            Boolean isValid = tokenService.getValidation(accessToken);
            if (isValid) {
                return ResponseEntity.status(200).body("VALID ACCESS TOKEN ");
            }
        } catch (CustomJWTException e) {
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
    })

    @PostMapping("/validate/refresh")
    public ResponseEntity<String> getRefreshValidation (@CookieValue(value = "refreshToken") String refreshToken) {
        try {
            Boolean isValid = tokenService.getValidation(refreshToken);
            if (isValid) {
                return ResponseEntity.status(200).body("VALID REFRESH TOKEN ");
            }
        } catch (CustomJWTException e) {
            throw e;
        }
        return ResponseEntity.status(500).body("ERROR");
    }

    @ApiOperation(value = "refresh 토큰으로 access 토큰 발급", notes = "(쿠키) refreshToken : refresh 토큰 값")
    @ApiResponses({
            @ApiResponse(code = 200, message = "access 토큰 발급 성공"),
            @ApiResponse(code = 400, message = "refresh 토큰값이 null"),
            @ApiResponse(code = 500, message = "서버 오류 (서버 관리자에게 알려주세요)")
    })

    @PostMapping("/create")
    public ResponseEntity<String> getAccessTokenByRefreshToken (@CookieValue(value = "refreshToken") String refreshToken, HttpServletResponse response) {
        String accessToken = tokenService.getAccessTokenByRefreshToken(refreshToken);
        response.addHeader("accessToken", accessToken);
        return ResponseEntity.status(200).body(accessToken);
    }

}
