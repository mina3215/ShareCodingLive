package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import com.codragon.sclive.jwt.JWTUtil;
import com.codragon.sclive.jwt.Jwt;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@SpringBootTest
@DisplayName("CodeSaveUtil 테스트")
class CodeSaveUtilTest {

    @Autowired
    CodeUtil codeUtil;

    @Autowired
    RedisTemplate<String, Object> redisTemplate;

    @Autowired
    RedisTemplate<String, String> redisTemplate1;

    @Autowired
    JWTUtil jwtUtil;

    @Autowired
    Jwt jwt;

    @Test
    void RT_저장_테스트() {

        String refreshToken = jwt.createRefreshToken("ssafy@ssafy.com", "ssafyy");
        log.info("refreshToken: {}", refreshToken);

        log.info("rr: {}", redisTemplate1);
        jwtUtil.saveUserRefreshToken("ssafy@ssafy.com", refreshToken);
        String userRefreshToken = jwtUtil.getUserRefreshToken("ssafy@ssafy.com");

        log.info("rt: {}", refreshToken);
        log.info("rt: {}", userRefreshToken);

        Assertions.assertEquals(userRefreshToken, refreshToken);
    }

    @Test
    @Order(2)
    void 코드_저장_테스트2() {
        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();
        Map<String, Code> map = new HashMap<>();

        Code code = new Code();
        code.setCourse_id("id");

        code.setContent("contentAA");
        map.put("first", code);

        code.setContent("contentBB");
        map.put("second", code);

        code.setContent("contentCC");
        map.put("third", code);

        hashOperations.putAll("Python_Class", map);

        Code extraCode = new Code();
        extraCode.setCourse_id("extra");
        extraCode.setContent("extra&extra");
        map.put("extra", extraCode);
        hashOperations.putAll("Java_Class", map);

        Code first = hashOperations.get("Java_Class", "first");
        Code extra = hashOperations.get("Java_Class", "extra");
        Code second = hashOperations.get("Python_Class", "second");
        Code third = hashOperations.get("Python_Class", "third");

        log.info("first: {}", first);
        log.info("second: {}", second);
        log.info("third: {}", third);
        log.info("extra: {}", extra);

        // javaClassA: {third=Code(c_id=id, content=contentCC), first=Code(c_id=id, content=contentCC), second=Code(c_id=id, content=contentCC), extra=Code(c_id=id, content=contentCC)}
        Map<String, Code> javaClass = hashOperations.entries("Java_Class");
        // javaClassB: [third, first, second, extra]
        Set<String> javaClass1 = hashOperations.keys("Java_Class");
        log.info("javaClassA: {}", javaClass);
        log.info("javaClassB: {}", javaClass1);
        Long length = hashOperations.lengthOfValue("Java_Class", "extra");
        log.info("length: {}", length);
    }

    @Test
    @Order(1)
    void 코드_저장_테스트3() {
        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();

        Set<String> javaClass = hashOperations.keys("Java_Class");
        System.out.println("javaClass = " + javaClass);
    }

    @Test
    void 코드_저장_테스트4() {
        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();

        Code code = new Code();
        code.setCourse_id("code");
        code.setContent("@Bean\n" +
                "    public RedisTemplate<?, ?> redisTemplate() {\n" +
                "\n" +
                "        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();\n" +
                "        redisTemplate.setConnectionFactory(redisConnectionFactory());\n" +
                "\n" +
                "        redisTemplate.setKeySerializer(new StringRedisSerializer());   // Key: String\n" +
                "        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));\n" +
                "\n" +
                "        // Hash Operation 사용 시\n" +
                "        redisTemplate.setHashKeySerializer(new StringRedisSerializer());\n" +
                "        redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Code.class));\n" +
                "\n" +
                "        // 혹은 아래 설정으로 모든 Key / Value Serialization을 변경할 수 있음\n" +
                "        redisTemplate.setDefaultSerializer(new StringRedisSerializer());\n" +
                "\n" +
                "        return redisTemplate;\n" +
                "    }");

        hashOperations.put("Java_Class", "IT'S CODE", code);

        Code getCode = hashOperations.get("Java_Class", "IT'S CODE");
        log.info("code: \n\n {} \n\n", getCode);
    }

//    @Test
//    void 코드_저장_테스트(){
//        ChatMessage chatMessage = new ChatMessage();
//        chatMessage.setType(ChatMessage.MessageType.CODE);
//        chatMessage.setMessage("System.out.print(\"Hello World!\")");
//        chatMessage.setSender("귀요미");
//        chatMessage.setRoomId("hellohi");
//        int res = codeUtil.saveCode(chatMessage);
//        log.info("결과는 {}",res);
//    }

//    @Test
//    void 코드_불러오기_테스트(){
//        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
//        hashOperations.put("chat1", "code1", "hello");
//    }


//    @Test
//    void 해시_테이블_테스트() throws JsonProcessingException {
//        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
//
//        Code code = new Code();
//        code.setC_id("code1");
//        code.setContent("hellohi");
//
//        Code code2 = new Code();
//        code2.setC_id("code2");
//        code2.setContent("아이고 반갑소");
//
//        // code를 json 형식으로 변형
//        ObjectMapper objectMapper = new ObjectMapper();
//        String json = objectMapper.writeValueAsString(code);
//        String json2 = objectMapper.writeValueAsString(code2);
//
//
//        // 디비에 저장
//        hashOperations.put("chat1", "code1", json);
//
//        hashOperations.put("chat1", "code2", json2);
//
//        // String으로 받아서 다시 code로 변경
////        String result = (String) hashOperations.get("chat1", "code1");
////        Code recievedCode = objectMapper.readValue(result, Code.class);
////        System.out.println(recievedCode.getContent());
//
//        Map<Object, Object> map = hashOperations.entries("chat1");
//        String result3 = (String) map.get("code1");
//        String result4 = (String) map.get("code2");
//
//        Code rCode = objectMapper.readValue(result3, Code.class);
//        log.debug(rCode.getContent());
//
//    }
}
