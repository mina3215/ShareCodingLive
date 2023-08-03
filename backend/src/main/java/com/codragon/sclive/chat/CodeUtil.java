package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static java.util.Objects.isNull;

@Slf4j
@Component
@RequiredArgsConstructor
public class CodeUtil {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 채팅 코드 저장
     *
     * @param message 메시지
     *
     * @return 0이면 실패, 1이면 성공
     */
    public int saveCode(ChatMessage message){
        if(isNull(message.getMessage())||isNull(message.getRoomId())){
            return 0;
        }

        //코드id(auto-increment) 회의방uuid 제목 내용 생성시간 한줄평(일단 null)

//        UUID uuid = UUID.randomUUID();
//        String title = this.getTitle(message.getMessage());
//        Date date = new Date();

//        Map<String,String> code = new HashMap<>();
//        code.put("code_id", uuid.toString()); //uniqe id 생성해서 넣기
//        code.put("cid", message.getRoomId());
//        code.put("title", title);
//        code.put("content", message.getMessage());
//        code.put("created_time",date.toString());
//        code.put("review", "리뷰입니다.");

//        Code code = new Code();
//        code.setC_id("chat1");
//        code.setContent("helloworld");
//
//        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
//        hashOperations.put("chat1", "code1", code);
        return 1;
    }

    /**
     * 파라미터로 전달된 회의방 uuid의 코드들 반환
     *
     * @param roomId 정보를 조회하고 싶은 roomId
     *
     * @return userRefreshToken or 없거나 만료될 경우 -1
     */
    public Code getCodebyRoomId(String roomId){
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        Map<Object, Object> map = hashOperations.entries("code1");
        log.info("get '{}' Code '{}'",roomId, map.get("content"));
        Code code = new Code();
        if(isNull(map)){
             code = null;
        }
        return code;
    }

//    private String getTitle(String code) { //코드의 제목을 짓는다.
//        String title = code.substring(0,Math.min(20, code.length()));
//        return title;
//    }

}
