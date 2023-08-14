package com.codragon.sclive.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        CustomJWTException exception = (CustomJWTException) request.getAttribute("exception");
        log.error("JWT ERROR: {}", exception.toString());
//        System.out.println("exception = " + exception.getStackTrace());
        exception.getStackTrace();
    }
}
