package com.codragon.sclive.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;

public class Jwt {
    // 현재 시간
    private final Date now = new Date();

    // 헤더 설정
    private final HashMap<String, Object> headerMap = new HashMap<>() {{
        put("alg", "HS256");
        put("typ", "JWT");
    }};

    // 시크릿 키 생성
    private final String random256BitKey = "6v9y$B&E)H@MbQeThWmZq4t7w!z%C*F-";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(random256BitKey.getBytes());

    public String createRefreshToken(String email, String nickname) {
        // 100*60*60 - 1시간
        Date exp = new Date(now.getTime() + 1000*60*60*24*30*3);

        String refreshToken = Jwts.builder()
                .setHeaderParams(headerMap)
                .setExpiration(exp)
                .setIssuedAt(now)
                .claim("email", email)
                .claim("nickname", nickname)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        return refreshToken;
    }


    public String createAccessToken(String email, String nickname) {
        // 100*60*60 - 1시간
        Date exp = new Date(now.getTime() + 1000*60*60);

        String accessToken = Jwts.builder()
                .setHeaderParams(headerMap)
                .setExpiration(exp)
                .setIssuedAt(now)
                .claim("email", email)
                .claim("nickname", nickname)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        return accessToken;
    }

    public String validateToken(String token) {
        Jws<Claims> jws = null;

        try {
            jws = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
        } catch (JwtException e) {
            System.err.println("유효하지 않은 토큰입니다...");
            // TODO: 유효하지 않음 return 쳐야함
        }

        Date expDate = jws.getBody().getExpiration();
        Date now = new Date();
        // 만요일이 현재 시간보다 이전인 경우
        if (expDate.compareTo(now) < 0) {
            // TODO: 만료시간 관련 return 처리
        }

        String nickname = (String) jws.getBody().get("nickname");
        return nickname;
    }

    public static void main(String[] args) {
        Jwt jwt = new Jwt();

        System.out.println(jwt.validateToken(jwt.createAccessToken("this", "is valid?")));

    }
}
