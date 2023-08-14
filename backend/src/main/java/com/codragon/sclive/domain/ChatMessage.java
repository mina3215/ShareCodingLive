package com.codragon.sclive.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import com.codragon.sclive.chat.MessageType;

import java.util.Set;


@Getter
@Setter
@ToString
public class ChatMessage {

    private MessageType type;       // Message Type

    private String roomId;          // Room UUID

    private String sender;          // 보낸 사람

    private String message;         // 보낸 메시지

    private String sendTime;        // 전송 시간

    private String title;           // 코드 제목

    private String summarization;   // 코드 요약

    private String language;

    private Set<String> participants;
}
