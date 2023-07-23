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
    Jwt jwt = new Jwt(); //new 안하면 에러 발생

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("필터 진입 완료!!!!!!!!!!!!!!!!!!!!!!");

        String path = request.getServletPath();
        log.info("servletPath : " + path);

        if(!path.contains("/user/login")&& !path.contains("/user/signup")) {
            log.info("토큰 검증 완료!!!!!!!!!!!!!!");
            //헤더에서 AccessToken을 받아온다.
            String accessToken = request.getHeader("AccessToken");
            //토큰을 검증한다.
            jwt.validateToken(accessToken); //이상한 토큰, 유효기간 만료 토큰은 error 발생 -> error handler로
            // Fixme : 정상 토큰을 넣어도 유효하지 않은 토큰으로 나옴 -> 해결 : 키를 value로 가져오지 않으면 괜찮다.

            // Todo : UserDetails 구현하기, accessToken으로 authentication 객체 생성하기, hasRole 검사
//         Authentication authentication = jwt.getAuthentication(newAccessToken);
//        SecurityContextHolder.getContext().setAuthentication(authentication);// SecurityContext에 Authentication 객체 저장
//        response.addHeader("Authorization", newAccessToken);
        }
        filterChain.doFilter(request,response);
    }
}
