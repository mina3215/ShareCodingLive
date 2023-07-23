package com.codragon.sclive.jwt;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
@DisplayName("JWT Util 서비스")
class JWTUtilTest {

    @Autowired
    Jwt jwt;

    @Test
    @DisplayName("JWT 검증")
    void createAccessToken() {
        final boolean result = true;

//        String accessToken = jwt.createAccessToken("test", "test");
        boolean valid = jwt.validateToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTAzNDQwMjAsImlhdCI6MTY5MDM0NDAyMCwiZW1haWwiOiJzc2FmeUBzc2FmeS5jb20iLCJuaWNrbmFtZSI6ImhlbGxvc3NhZnkifQ.Pg3E0VI1pzsjMyaNOJD83r6j6M-GBGyNB-kqdWAWXRg");

        log.debug("result: {}, actual: {}", valid, true);
        Assertions.assertEquals(valid, result);
    }

    @Test
    @DisplayName("토큰 안의 닉네임 반환 테스트")
    void checkNickname() {
        String result = "Test";

        String accessToken = jwt.createAccessToken("test", "Test");
        String nickname = jwt.getNicknameFromToken(accessToken);
        log.info("result: {}, actual: {}", nickname, result);

        Assertions.assertEquals(nickname, result);
    }

    @Test
    @DisplayName("토큰 안의 이메일 반환 테스트")
    void checkEmail() {
        String result = "Test";

        String accessToken = jwt.createAccessToken("Test", "1234");
        String email = jwt.getEmailFromToken(accessToken);
        log.info("result: {}, actual: {}", email, result);

        Assertions.assertEquals(email, result);
    }

    @Test
    @DisplayName("JWT access 토큰 발급")
    void getAccessToken() {

        String accessToken = jwt.createRefreshToken("ssafy@ssafy.com", "hellossafy");
        System.out.println(accessToken);
        log.debug("refresh: {}", accessToken);
    }
}