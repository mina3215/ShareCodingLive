package com.codragon.sclive.controller;

import com.codragon.sclive.domain.ChatRoom;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Api(value = "채팅 API", tags = {"Chat"})
@Slf4j
@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "192.168.100.128", allowCredentials = "true")
public class ChatController {

    @ApiOperation(value = "채팅방 생성", notes = "roomId : 회의방 uuid\n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "채팅방 생성 실패"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/room")
    public ChatRoom createRoom(@RequestParam String roomId) {
        ChatRoom chatRoom = ChatRoom.create(roomId);
        System.out.println("chatRoom = " + chatRoom);
        return chatRoom;
    }
}
