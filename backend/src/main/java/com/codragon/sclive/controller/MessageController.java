package com.codragon.sclive.controller;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.service.MessageService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessageSendingOperations sendingOperations;

    private final MessageService messageService;

    @ApiOperation(value = "메시지 전송", notes = "ChatMessage 필수\n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "메시지 전송 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @MessageMapping("/chat/message")
    public void enter(ChatMessage message) {

        log.debug("receive Message: {}", message);
        ChatMessage chatMessage = messageService.processMessage(message);
        log.debug("send Message: {}", chatMessage);

        //채팅방 토픽으로 메시지를 전송한다.
        sendingOperations.convertAndSend("/topic/chat/room/" + message.getRoomId(), chatMessage);
    }
}
