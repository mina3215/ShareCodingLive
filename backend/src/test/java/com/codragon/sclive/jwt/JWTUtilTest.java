package com.codragon.sclive.jwt;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;


@DisplayName("JWT Util 테스트")
@SpringBootTest
class JWTUtilTest {

    @Autowired
    private JWTUtil jwtUtil;

    @Test
    @DisplayName("Refresh Token 저장 및 불러오기 테스트")
    @Transactional
    void saveUserRefreshToken() {

        // Given
        String tmpUserEmail = "ssafy@ssafy.com";
        String tmpRefreshToken = UUID.randomUUID().toString();

        // When
        int result = jwtUtil.saveUserRefreshToken(
                tmpUserEmail,
                tmpRefreshToken
        );

        // Then
        Assertions.assertEquals(result, 1);

        // When
        String findUserRefreshToken = jwtUtil.getUserRefreshToken(tmpUserEmail);

        // Then
        Assertions.assertEquals(findUserRefreshToken, tmpRefreshToken);
    }
}