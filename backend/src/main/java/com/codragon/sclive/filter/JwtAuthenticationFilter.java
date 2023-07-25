package com.codragon.sclive.filter;

import com.codragon.sclive.exception.CustomJWTException;
import com.codragon.sclive.jwt.Jwt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final Jwt jwt;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        /*
        현재 Request 및 Client 정보 출력
        - 요청된 URL
        - 요청된 HTTP Method
         */
        final String URL = request.getServletPath();
        final String METHOD = request.getMethod();

        log.debug("enter JwtAuthenticationFilter");
        log.debug("[{}] get Request to '{}'", METHOD, URL);

        // Header에서 AccessToken 받기
        final String authenticationToken = request.getHeader("Authorization");

        // AccessToken이 없거나, 'Bearer '로 시작하지 않는 경우
        if (authenticationToken == null || !authenticationToken.startsWith("Bearer ")) {

            log.error("token is null or not JWT token");
            filterChain.doFilter(request, response);
            return;
        }

        final String accessToken = authenticationToken.substring(7);

        /*
        Access Token 검증 단계
        조작된 Token 및 유효 기간이 만료된 Token은
        Exception Handler로 Error 처리
         */
        if (jwt.validateToken(accessToken, request)) {

            final String userEmail = jwt.getEmailFromToken(accessToken);
            UserDetails findUserDetails = userDetailsService.loadUserByUsername(userEmail);
            log.info("find UserDetails of Client: {}", findUserDetails);

            UsernamePasswordAuthenticationToken userAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    findUserDetails,
                    null,
                    findUserDetails.getAuthorities()
            );

            userAuthenticationToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(userAuthenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}
