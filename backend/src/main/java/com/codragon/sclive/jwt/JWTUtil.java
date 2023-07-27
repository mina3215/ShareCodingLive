package com.codragon.sclive.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.util.concurrent.TimeUnit;

import static java.util.Objects.isNull;


/**
 * JWT 관련 기능들을 처리해주는 Util Class
 *
 * @author MinSu
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JWTUtil {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 유저 Refresh Token 저장
     *
     * @param userEmail 유저 이메일
     * @param refreshToken 현재 유저 Refresh Token
     *
     * @return 0이면 실패, 1이면 성공
     */
    public int saveUserRefreshToken(String userEmail, String refreshToken) {

        if (isNull(userEmail) || isNull(refreshToken)) {
            return 0;
        }

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        // TODO: Refresh Token 유효 시간 정하고, application.yml 파일에서 불러오기
        valueOperations.set(userEmail, refreshToken, 30L, TimeUnit.MINUTES);

        log.info("set '{}' Refresh Token: '{}'", userEmail, refreshToken);

        return 1;
    }

    /**
     * 파라미터로 전달된 이메일의 유저 Refresh Token 반환
     *
     * @param userEmail 유저 이메일
     * @return userRefreshToken or 없거나 만료될 경우 -1
     */
    public String getUserRefreshToken(String userEmail) {

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String userRefreshToken = valueOperations.get(userEmail);

        log.info("get '{}' Refresh Token: '{}'", userEmail, userRefreshToken);

        if (isNull(userRefreshToken)) {
            userRefreshToken = "-1";
        }

        return userRefreshToken;
    }

    /**
     * 파라미터로 전달된 이메일의 유저 Refresh Token 삭제
     *
     * @param userEmail 유저 이메일
     * @return 0이면 실패, 1이면 성공
     */
    public int deleteUserRefreshToken(String userEmail) {

        if (isNull(userEmail)) {
            return 0;
        }

        Boolean isDeleted = redisTemplate.delete(userEmail);

        if (isDeleted) {
            log.info("delete '{}'", userEmail);
            return 1;
        }
        return 0;
    }


}
