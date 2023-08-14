package com.codragon.sclive.jwt;

import com.codragon.sclive.exception.CustomJWTException;
import com.codragon.sclive.exception.JWTErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeoutException;


@Component
public class Jwt {

    private final int FIVE_MINUTES = 1000 * 60 * 5 * 1000;
    private final int THREE_DAYS = 1000 * 60 * 60 * 24 * 3;

    // 헤더 설정
    private final HashMap<String, Object> headerMap = new HashMap<>() {{
        put("alg", "HS256");
        put("typ", "JWT");
    }};

    @Value("${spring.auth.secretKey}")
    private String random256BitKey;

    private SecretKey secretKey;

    @PostConstruct
    private void generateSecretKey() {
        secretKey = Keys.hmacShaKeyFor(random256BitKey.getBytes(StandardCharsets.UTF_8));
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
        Date exp = new Date(getCurrentTime() + FIVE_MINUTES);

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

    public boolean validateToken(String token, HttpServletRequest request) {
        Jws<Claims> jws;

        // 유효한 토큰인지 확인
        try {
            jws = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
        } catch (ExpiredJwtException e) {
            // 유효 기간이 지난 토큰
            CustomJWTException customException = new CustomJWTException(JWTErrorCode.EXPIRED_TOKEN);
            request.setAttribute("exception", customException);
            return false;
        } catch (CompressionException | MalformedJwtException | UnsupportedJwtException e) {
            // 압축 오류, 키 틀림 오류, 해당 토큰과 맞지 않는 토큰 타입 오류
            throw new CustomJWTException(JWTErrorCode.NOT_VALID_TOKEN);
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

    public String removeBearer(String token){
        token = token.substring(7);
        return token;
    }
}
