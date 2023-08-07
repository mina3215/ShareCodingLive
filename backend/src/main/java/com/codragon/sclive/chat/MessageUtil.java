package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

        senderCode = "```" +
                "const recvMessage = (recv) => {\n" +
                "    if (recv.type === 'ENTER') {\n" +
                "      setMembers((prevMerbers) => [\n" +
                "        ...prevMerbers,\n" +
                "        { sender: recv.sender, members: recv.message},\n" +
                "      \n" +
                "      ]);\n" +
                "    }\n" +
                "    else if (recv.type === 'QUIT') {\n" +
                "      setMembers(members.filter(member => member !== recv.sender))\n" +
                "\n" +
                "    }\n" +
                "    else if (recv.type === 'TALK') {\n" +
                "      setChats((prevChats) => [\n" +
                "        ...prevChats,\n" +
                "        { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},\n" +
                "      \n" +
                "      ]);\n" +
                "\n" +
                "    }\n" +
                "    else if (recv.type === 'QUESTION') {\n" +
                "      setQuestions((prevQuestions) => [\n" +
                "        ...prevQuestions,\n" +
                "        { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},\n" +
                "      \n" +
                "      ]);\n" +
                "\n" +
                "    }\n" +
                "    else if (recv.type === 'CODE') {\n" +
                "      setCodes((prevCodes) => [\n" +
                "        ...prevCodes,\n" +
                "        { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime , title: recv.title, summarization: recv.summarization},\n" +
                "      \n" +
                "      ]);\n" +
                "\n" +
                "    }\n" +
                "    \n" +
                "  };" +
                "```";

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
            returnMessage.setMessage(comment.get().getBody().getChoices().get(0).getMessage().content);
            returnMessage.setSummarization(summarize.get().getBody().getChoices().get(0).getMessage().content);
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
