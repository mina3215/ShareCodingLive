package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType{
        ENTER, TALK, CODE, QUESTION
    }

    private MessageType type;

    private String roomId;

    private String sender;

    private String message;
}
