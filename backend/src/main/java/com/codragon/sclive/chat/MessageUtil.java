package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Slf4j
@Component
@RequiredArgsConstructor
public class MessageUtil {

    private final ChatGPTUtil chatGPTUtil;
    private final ParticipantService participantService;

    public ChatMessage hand(ChatMessage senderMessage, ChatMessage returnMessage) {

        returnMessage.setType(senderMessage.getType());
        returnMessage.setSender(senderMessage.getSender());

        return returnMessage;
    }

    public ChatMessage enter(ChatMessage senderMessage, ChatMessage returnMessage) {

        String roomId = senderMessage.getRoomId();
        String newParticipantName = senderMessage.getSender();

        log.info("{} 강의방에 {}이 참여했습니다", roomId, newParticipantName);

        participantService.joinParticipant(roomId, senderMessage.getSender());

        returnMessage.setSender(newParticipantName);
        returnMessage.setParticipants(participantService.getAllParticipantInCurrentRoom(roomId));

        return returnMessage;
    }

    public ChatMessage quit(ChatMessage senderMessage, ChatMessage returnMessage) {

        String leaveParticipantName = senderMessage.getSender();

        returnMessage.setMessage(leaveParticipantName);

        return returnMessage;
    }

    public ChatMessage talk(ChatMessage senderMessage, ChatMessage returnMessage) {
        return senderMessage;
    }

    public ChatMessage code(ChatMessage senderMessage, ChatMessage returnMessage) {

        String senderCode = senderMessage.getMessage();

        log.debug("prepare to send User's Code to ChatGPT");
        long start = System.currentTimeMillis();

        try {
            CompletableFuture<ResponseEntity<ChatGptResponse>> title = chatGPTUtil.getTitle(senderCode);
            CompletableFuture<ResponseEntity<ChatGptResponse>> summarize = chatGPTUtil.getSummarize(senderCode);
            CompletableFuture<ResponseEntity<ChatGptResponse>> comment = chatGPTUtil.addComment(senderCode);

            CompletableFuture.allOf(title, summarize, comment).join();

            log.info("Elapsed time: " + (System.currentTimeMillis() - start));
            log.info("title: {}", title.get().getBody().getChoices().get(0).getMessage().content);
            log.info("summarize: {}", summarize.get().getBody().getChoices().get(0).getMessage().content);
            log.info("comment: {}", comment.get().getBody().getChoices().get(0).getMessage().content);

            returnMessage.setTitle(title.get().getBody().getChoices().get(0).getMessage().content);
            returnMessage.setSummarization(summarize.get().getBody().getChoices().get(0).getMessage().content);

            ArrayList<String> codeInfo = convertCode(comment.get().getBody().getChoices().get(0).getMessage().content);
            returnMessage.setLanguage(codeInfo.get(0));
            returnMessage.setMessage(codeInfo.get(1));

        } catch (InterruptedException | ExecutionException e) {
            log.error("ChatGPT 통신 에러");
            e.getStackTrace();
        }

        return returnMessage;
    }

    public ChatMessage question(ChatMessage senderMessage, ChatMessage returnMessage) {
        returnMessage.setMessage(senderMessage.getMessage().substring(1));
        return returnMessage;
    }

    private ArrayList<String> convertCode(String chatGPTCode) {

        // 코드 언어가 표기된 백틱 언어와 분리
        String[] splitString = chatGPTCode.split("\\n", 2);

        // 이 코드의 언어 추출
        String language = splitString[0].substring(3);

        // 백틱 제거한 코드만 추출
        int len = splitString[1].length();
        String code = splitString[1].substring(0, len - 4);
        
        // 언어, 코드
        ArrayList<String> result = new ArrayList<>();
        result.add(language);
        result.add(code);

        return result;
    }
}
