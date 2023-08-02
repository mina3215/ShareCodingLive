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

    private String roomId;

    private String sender;

    private String message;

    //전송 시간
    private String sendTime;
}
