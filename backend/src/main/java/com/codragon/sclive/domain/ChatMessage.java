package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatMessage {

    public enum MessageType{ //QUIT 추가
        ENTER, QUIT, TALK, CODE, QUESTION
    }

    private MessageType type;

    private String roomId; // uuid

    private String sender; // nickname

    private String message;
    
    private String sendTime; // 전송 시간

    private String title; // 코드 제목

    private String summarization; // 요약
}
