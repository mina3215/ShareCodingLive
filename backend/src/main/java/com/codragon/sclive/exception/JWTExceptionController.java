package com.codragon.sclive.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestControllerAdvice
public class JWTExceptionController {

    private ResponseEntity<Map<String, String>> makeErrorMsg(JWTErrorCode error) {

        HttpHeaders responseHeaders = new HttpHeaders();
        HttpStatus httpStatus = error.getHttpStatus();

        Map<String, String> map = new HashMap<>();
        map.put("error type", httpStatus.getReasonPhrase());
        map.put("code", error.name());
        map.put("message", error.getMessage());

        return new ResponseEntity<>(map, responseHeaders, httpStatus);
    }

    @ExceptionHandler(value = CustomJWTException.class)
    public ResponseEntity<Map<String, String>> handleCustomException(CustomJWTException e) {
        // CustomException 클래스의 jwtErrorCode 멤버 변수를 반환
        return makeErrorMsg(e.getJwtErrorCode());
    }
}