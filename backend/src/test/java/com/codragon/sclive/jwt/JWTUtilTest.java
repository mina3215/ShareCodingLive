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

        String accessToken = jwt.createAccessToken("test", "test");
        boolean valid = jwt.validateToken(accessToken);

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
}