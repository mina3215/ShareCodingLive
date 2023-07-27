package com.codragon.sclive.controller;

import com.codragon.sclive.domain.ChatRoom;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    @ApiOperation(value = "채팅방 생성", notes = "roomId : 회의방 uuid\n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "채팅방 생성 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/room")
    public ChatRoom createRoom(@RequestParam String roomId) {
        ChatRoom chatRoom = new ChatRoom();
        return chatRoom;
    }
}
