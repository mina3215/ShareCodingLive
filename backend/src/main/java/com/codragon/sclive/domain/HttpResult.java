package com.codragon.sclive.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
public class HttpResult {

    private HttpStatus status;

    private Result result;

    private String message;

    private Object data;

    public HttpResult(HttpStatus status, Result result, String message) {
        this.status = status;
        this.result = result;
        this.message = message;
    }

    public static enum Result {
        SUCCESS, ERROR
    }

    static public HttpResult getSuccess(){
        HttpResult result = new HttpResult(HttpStatus.OK,Result.SUCCESS,"SUCCESS");
        return result;
    }
}
