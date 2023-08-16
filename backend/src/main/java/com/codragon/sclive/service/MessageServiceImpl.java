package com.codragon.sclive.service;

import com.codragon.sclive.chat.*;
import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import io.netty.handler.codec.UnsupportedMessageTypeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static com.codragon.sclive.chat.MessageType.*;


@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageUtil messageUtil;
    private final CodeService codeService;

    private static final String CODE_PREFIX = "```";
    private static final String QUESTION_PREFIX = "?";

    private String getCurrentTime() {

        LocalDateTime now = LocalDateTime.now();
        String currentTime = now.format(DateTimeFormatter.ofPattern("a hh:mm"));

        return currentTime;
    }

    private MessageType checkMessageType(ChatMessage messageFromClient) {

        String clientMessage = messageFromClient.getMessage();
        log.info("clientMessage: {}", clientMessage);
        MessageType messageType = messageFromClient.getType();

        if (clientMessage.startsWith(CODE_PREFIX) && clientMessage.endsWith(CODE_PREFIX)) {
            messageType = CODE;
        } else if (clientMessage.startsWith(QUESTION_PREFIX) && clientMessage.endsWith(QUESTION_PREFIX)) {
            messageType = QUESTION;
        }

        return messageType;
    }

    /**
     * 메시지 타입에 따라 메시지를 가공하여 채팅방으로 다시 전달 <br>
     * 1. 메시지 타입 체크        : checkMessageType <br>
     * 2. 각 메시지에 따라 가공   : MessageUtil <br>
     * 3. 메시지에 보낸 시간 처리 : getCurrentTime <br>
     *
     * @param messageFromClient 클라이언트에게 온 메시지
     * @return 가공된 메시지
     */
    @Override
    public ChatMessage processMessage(ChatMessage messageFromClient) {

        String clientMessage = messageFromClient.getMessage();
        if (clientMessage == null) {
            messageFromClient.setMessage("");
        }

        MessageType MESSAGE_TYPE = checkMessageType(messageFromClient);
        ChatMessage answerMessage = new ChatMessage();

        answerMessage.setType(MESSAGE_TYPE);
        answerMessage.setRoomId(messageFromClient.getRoomId());
        answerMessage.setSender(messageFromClient.getSender());

        switch (MESSAGE_TYPE) {

            case ENTER:
                answerMessage = messageUtil.enter(messageFromClient, answerMessage);
                break;
            case QUIT:
                answerMessage = messageUtil.quit(messageFromClient, answerMessage);
                break;
            case TALK:
                answerMessage = messageUtil.talk(messageFromClient, answerMessage);
                break;
            case CODE:
                answerMessage = messageUtil.code(messageFromClient, answerMessage);

                String roomId = messageFromClient.getRoomId();
                String codeTitle = answerMessage.getTitle();

                Code savedCode = codeService.generateCodeByAnswerMessage(answerMessage);

                codeService.saveCode(roomId, codeTitle, savedCode);
                break;
            case QUESTION:
                answerMessage = messageUtil.question(messageFromClient, answerMessage);
                break;
            case HAND_UP:
            case HAND_DOWN:
                answerMessage = messageUtil.hand(messageFromClient, answerMessage);
                break;
            default:
                log.error("알 수 없는 메시지 종류: {}", MESSAGE_TYPE);
                throw new UnsupportedMessageTypeException("알 수 없는 메시지 종류입니다.");
        }

        answerMessage.setSendTime(getCurrentTime());

        return answerMessage;
    }
}
