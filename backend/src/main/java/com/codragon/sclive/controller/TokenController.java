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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Api(value = "토큰 API", tags = {"Token"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
@Slf4j
public class TokenController {
    private final TokenService tokenService;

    @ApiOperation(value = "access 토큰 검증", notes = "")
    @ApiResponses({
            @ApiResponse(code = 200, message = "유효하고 만료되지 않은 토큰"),
            @ApiResponse(code = 400, message = "검증하지 못한 에러 (서버 관리자에게 알려주세요)"),
            @ApiResponse(code = 401, message = "유효하지 않은 토큰"),
            @ApiResponse(code = 406, message = "만료된 토큰"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/validate/access")
    public ResponseEntity<String> getAccessValidation (@RequestHeader("Authorization") String authorizationHeader) {
        try {
            Boolean isValid = tokenService.getValidation(authorizationHeader);
            if (isValid) {
                return ResponseEntity.status(200).body("VALID");
            }
        } catch (CustomException e) {
            throw  e;
        }
        return ResponseEntity.status(400).body("검증하지 못한 에러");
    }

}
