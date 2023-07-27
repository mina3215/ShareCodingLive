package com.codragon.sclive.jwt;

import com.codragon.sclive.exception.CustomJWTException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;


@Slf4j
@SpringBootTest
@DisplayName("JWT Util 서비스")
class JWTUtilTest {

    @Autowired
    Jwt jwt;

    @Test
    void 토큰에서_닉네임_반환_테스트() {
        String result = "Test";

        String accessToken = jwt.createAccessToken("test", "Test");
        String nickname = jwt.getNicknameFromToken(accessToken);
        log.info("result: {}, actual: {}", nickname, result);

        Assertions.assertEquals(nickname, result);
    }

    @Test
    void 토큰에서_이메일_반환_테스트() {
        String result = "Test";

        String accessToken = jwt.createAccessToken("Test", "1234");
        String email = jwt.getEmailFromToken(accessToken);
        log.info("result: {}, actual: {}", email, result);

        Assertions.assertEquals(email, result);
    }

    @Test
    void access_토큰_발급() {
        String accessToken = jwt.createAccessToken("ssafy@ssafy.com", "ssafy");
        log.info("access: {}", accessToken);
    }

    @Test
    void 잘못_만들어진_토큰_예외_확인() {
        // given
        String token = "qwerfsvasgqwe.asdqfrgojqwoidfoiajsdifo.qwoioivifodnvas";

        // then
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> jwt.validateToken(token));

        // when
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("잘못 만들어진 토큰입니다! (해킹 위험)");
    }

    @Test
    void 유효기간이_지난_토큰_예외_확인() {
        // given
        String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTAxOTg2OTcsImlhdCI6MTY5MDE5ODY5NywiZW1haWwiOiJzc2FmeUBzc2FmeS5jb20iLCJuaWNrbmFtZSI6InNzYWZ5In0.SPYaFArs1vQsaReyEKGIx670LnCDt3QFm5OUc2n9-LY";

        // then
        CustomJWTException e = assertThrows(CustomJWTException.class, () -> jwt.validateToken(token));

        // when
        assertThat(e.getJwtErrorCode().getMessage()).isEqualTo("유효 기간이 지난 토큰입니다");
    }

    @Test
    void 같은_토큰_생성_확인() {
        // given
        String token1 = jwt.createAccessToken("test", "test");

        // then
        try {
            Thread.sleep(3000); // 3초 경과
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        String token2 = jwt.createAccessToken("test", "test");

        // when
        assertThat(token1).isNotEqualTo(token2);
    }
}
