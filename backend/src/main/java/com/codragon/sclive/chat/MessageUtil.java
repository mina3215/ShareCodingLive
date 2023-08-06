package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class MessageUtil {

    public ChatMessage enter(ChatMessage senderMessage, ChatMessage returnMessage) {

        String newParticipantName = senderMessage.getSender();
        log.info("{} 강의방에 {}이 참여했습니다", 1, newParticipantName);

        returnMessage.setMessage(newParticipantName.concat("님이 들어왔습니다"));

        return returnMessage;
    }

    public ChatMessage quit(ChatMessage senderMessage, ChatMessage returnMessage) {

        String quitParticipantName = senderMessage.getSender();

        returnMessage.setMessage(quitParticipantName.concat("님이 나갔습니다."));
        return returnMessage;
    }

    public ChatMessage talk(ChatMessage senderMessage, ChatMessage returnMessage) {
        return senderMessage;
    }

    public ChatMessage code(ChatMessage senderMessage, ChatMessage returnMessage) {
        return returnMessage;
    }

    public ChatMessage question(ChatMessage senderMessage, ChatMessage returnMessage) {
        returnMessage.setMessage(senderMessage.getMessage().substring(1));
        return returnMessage;
    }
}
