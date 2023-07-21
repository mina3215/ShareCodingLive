package com.codragon.sclive.jwt;

import com.codragon.sclive.exception.CustomException;
import com.codragon.sclive.exception.JWTErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;

@Component
public class Jwt {

    private final int FIVE_MINUTES = 1000 * 60 * 5;
    private final int THREE_DAYS = 1000 * 60 * 60 * 24 * 3;
    // 헤더 설정
    private final HashMap<String, Object> headerMap = new HashMap<>() {{
        put("alg", "HS256");
        put("typ", "JWT");
    }};

    // 시크릿 키 생성
    @Value("${spring.auth.secretKey}")
    private String random256BitKey;
    private SecretKey secretKey;
    @PostConstruct
    private void generateSecretKey() {
        secretKey = Keys.hmacShaKeyFor(random256BitKey.getBytes());
    }

    public String createRefreshToken(String email, String nickname) {
        Date exp = new Date(getCurrentTime() + THREE_DAYS);

        String refreshToken = Jwts.builder()
                .setHeaderParams(headerMap)
                .setExpiration(exp)
                .setIssuedAt(exp)
                .claim("email", email)
                .claim("nickname", nickname)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        return refreshToken;
    }


    public String createAccessToken(String email, String nickname) {
        Date exp = new Date(getCurrentTime()  + FIVE_MINUTES);

        String accessToken = Jwts.builder()
                .setHeaderParams(headerMap)
                .setExpiration(exp)
                .setIssuedAt(exp)
                .claim("email", email)
                .claim("nickname", nickname)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        return accessToken;
    }

    public boolean validateToken(String token) throws CustomException{
        Jws<Claims> jws;

        // 유효한 토큰인지 확인
        try {
            jws = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
        } catch (Exception e) {
            System.err.println("유효하지 않은 토큰입니다...");
            // JWTErrorCode enum의 상수인 NOT_VALID_TOKEN에 대한 객체가 생성
            throw new CustomException(JWTErrorCode.NOT_VALID_TOKEN);
        }

        // 만료된 토큰인지 확인
        Date expDate = jws.getBody().getExpiration();
        Date now = new Date();
        if (expDate.compareTo(now) < 0) { // 만료일이 현재 시간보다 이전인 경우
            throw new CustomException(JWTErrorCode.EXPIRED_TOKEN);
        }

        return true;
    }

    public String getNicknameFromToken(String token) {
        String nickname = (String) Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody().get("nickname");

        return nickname;
    }

    public String getEmailFromToken(String token) {
        String email = (String) Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody().get("email");

        return email;
    }

    private long getCurrentTime() {
        Date date = new Date(System.currentTimeMillis());
        return date.getTime();
    }
}
