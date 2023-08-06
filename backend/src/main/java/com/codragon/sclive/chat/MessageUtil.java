package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;


@Slf4j
@Component
@RequiredArgsConstructor
public class MessageUtil {

    private final ChatGPTUtil chatGPTUtil;

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

        String senderCode = senderMessage.getMessage();

        // 제목, 주석, 요약 순
        ArrayList<String> result = chatGPTUtil.generateDetailCodeWithChatGPT(senderCode);

        returnMessage.setTitle(result.get(0));
        returnMessage.setMessage(result.get(1));
        returnMessage.setSummarization(result.get(2));

        return returnMessage;
    }

    public ChatMessage question(ChatMessage senderMessage, ChatMessage returnMessage) {
        returnMessage.setMessage(senderMessage.getMessage().substring(1));
        return returnMessage;
    }
}
