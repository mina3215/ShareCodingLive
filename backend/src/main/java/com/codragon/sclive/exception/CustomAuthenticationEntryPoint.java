package com.codragon.sclive.exception;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        CustomJWTException exception = (CustomJWTException) request.getAttribute("exception");
        System.out.println("CustomAuthenticationEntryPoint.commence");
        System.out.println("exception = " + exception);
    }
}
