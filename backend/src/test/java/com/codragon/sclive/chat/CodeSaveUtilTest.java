package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Map;

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


    @Test
    void 해시_테이블_테스트() throws JsonProcessingException {
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();

        Code code = new Code();
        code.setC_id("code1");
        code.setContent("hellohi");

        Code code2 = new Code();
        code2.setC_id("code2");
        code2.setContent("아이고 반갑소");

        // code를 json 형식으로 변형
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(code);
        String json2 = objectMapper.writeValueAsString(code2);


        // 디비에 저장
        hashOperations.put("chat1", "code1", json);

        hashOperations.put("chat1", "code2", json2);

        // String으로 받아서 다시 code로 변경
//        String result = (String) hashOperations.get("chat1", "code1");
//        Code recievedCode = objectMapper.readValue(result, Code.class);
//        System.out.println(recievedCode.getContent());

        Map<Object, Object> map = hashOperations.entries("chat1");
        String result3 = (String) map.get("code1");
        String result4 = (String) map.get("code2");

        Code rCode = objectMapper.readValue(result3, Code.class);
        log.debug(rCode.getContent());

    }
}