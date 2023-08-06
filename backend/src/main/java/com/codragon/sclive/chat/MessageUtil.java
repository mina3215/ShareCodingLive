package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Slf4j
@Component
@RequiredArgsConstructor
public class MessageUtil {

    private final ChatGPTUtil chatGPTUtil;
    private final ParticipantService participantService;

    public ChatMessage enter(ChatMessage senderMessage, ChatMessage returnMessage) {

        String roomId = senderMessage.getRoomId();
        String newParticipantName = senderMessage.getSender();

        log.info("{} 강의방에 {}이 참여했습니다", roomId, newParticipantName);

        participantService.joinParticipant(roomId, senderMessage.getSender());

        returnMessage.setSender(newParticipantName);
        returnMessage.setMessage(participantService.getAllParticipantInCurrentRoom(roomId).toString());

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
            CompletableFuture<String> title = chatGPTUtil.getTitle(senderCode);
            CompletableFuture<String> summarize = chatGPTUtil.getSummarize(senderCode);
            CompletableFuture<String> comment = chatGPTUtil.addComment(senderCode);

            CompletableFuture.allOf(title, summarize, comment).join();

            log.info("Elapsed time: " + (System.currentTimeMillis() - start));
            log.info("title: {}", title.get());
            log.info("summarize: {}", summarize.get());
            log.info("comment: {}", comment.get());

            returnMessage.setTitle(title.get());
            returnMessage.setMessage(comment.get());
            returnMessage.setSummarization(summarize.get());
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
}
