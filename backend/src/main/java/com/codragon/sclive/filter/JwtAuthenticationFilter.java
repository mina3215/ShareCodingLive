package com.codragon.sclive.filter;

import com.codragon.sclive.jwt.Jwt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final Jwt jwt;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //헤더에서 AccessToken을 받아온다.
        log.info("필터 진입 완료!!!!!!!!!!!!!!!!!!!!!!");
        String accessToken = request.getHeader("AccessToken");
        System.out.println(accessToken);
        //토큰을 검증한다.
        jwt.validateToken(accessToken); //이상한 토큰, 유효기간 만료 토큰은 error 발생 -> error handler로

        // Todo : UserDetails 구현하기, accessToken으로 authentication 객체 생성하기
//         Authentication authentication = jwt.getAuthentication(newAccessToken);
//        SecurityContextHolder.getContext().setAuthentication(authentication);// SecurityContext에 Authentication 객체 저장
//        response.addHeader("Authorization", newAccessToken);
    }
}
