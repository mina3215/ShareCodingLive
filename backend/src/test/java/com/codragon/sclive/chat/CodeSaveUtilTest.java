package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

@Slf4j
@SpringBootTest
@DisplayName("CodeSaveUtil 테스트")
class CodeSaveUtilTest {

    @Autowired
    CodeUtil codeUtil;

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    @Test
    void 코드_저장_테스트(){
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setType(ChatMessage.MessageType.CODE);
        chatMessage.setMessage("System.out.print(\"Hello World!\")");
        chatMessage.setSender("귀요미");
        chatMessage.setRoomId("hellohi");
        int res = codeUtil.saveCode(chatMessage);
        log.info("결과는 {}",res);
    }

    @Test
    void 코드_불러오기_테스트(){
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        hashOperations.put("chat1", "code1", "hello");
    }

}