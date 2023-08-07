package com.codragon.sclive.controller;

import com.codragon.sclive.chat.ChatGPTUtil;
import io.github.flashvayne.chatgpt.service.ChatgptService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(value = "Test API", tags = {"Test"})
@Slf4j
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    private final ChatgptService chatgptService;

    private final ChatGPTUtil chatGPTUtil;

//    @ApiOperation(value = "테스트 컨트롤러")
//    @PostMapping()
//    public String test(@RequestBody String question){
//        log.info("질문을 날려봅시다. : {}", question);
////        String answer = chatgptService.sendMessage(question);
////        String answer = chatGPTUtil.generateText("what is penguin?", 1.0f, 1000);
//
//        log.info("chatGPT의 대답 : {}",answer);
//
//        return answer;
//    }
}
