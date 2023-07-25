package com.codragon.sclive.service;

import com.codragon.sclive.exception.CustomJWTException;
import com.codragon.sclive.jwt.Jwt;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest
class TokenServiceImplTest {

    @Autowired
    TokenServiceImpl tokenService;
    @Autowired
    Jwt jwt;


    @Test
    public void refresh_값이_null일때_체크() {
        // given
        String refreshToken = null;

        // when
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> tokenService.getAccessTokenByRefreshToken(refreshToken));

        // then
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("refresh 토큰이 존재하지 않습니다");
    }

    @Test
    public void refresh_값이_empty일때_체크() {
        // given
        String refreshToken = "";

        // when
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> tokenService.getAccessTokenByRefreshToken(refreshToken));

        // then
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("refresh 토큰이 존재하지 않습니다");
    }

    @Test
    public void refresh_값이_유효하지_않을때_체크() {
        // given
        String refreshToken = "ㅁㄴㄹㅇㄴㄻㄴㅇㄻㄴㅇㄹ";

        // when
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> tokenService.getAccessTokenByRefreshToken(refreshToken));

        // then
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("잘못 만들어진 토큰입니다! (해킹 위험)");
    }

    @Test
    public void refresh_유효기간이_지났을때_체크() {
        // given
        String refreshToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTAyNTA3NjksImlhdCI6MTY5MDI1MDc2OSwiZW1haWwiOiJ0ZXN0Iiwibmlja25hbWUiOiJ0ZXN0In0.r3EqP_OdXPPUCSsjAtTTLLDvsS0MuFhJ3YgRZL7IKIM";

        // when
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> tokenService.getAccessTokenByRefreshToken(refreshToken));

        // then
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("유효 기간이 지난 토큰입니다");
    }

    @Test
    public void 다른_테스트를_위한_토큰_발급() {
        String refresh = jwt.createAccessToken("test", "test");

        log.info("access : {}", refresh);
    }
}