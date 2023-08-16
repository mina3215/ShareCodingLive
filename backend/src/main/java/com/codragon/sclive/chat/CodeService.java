package com.codragon.sclive.chat;

import com.codragon.sclive.domain.ChatMessage;
import com.codragon.sclive.domain.Code;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;


@Slf4j
@Component
@RequiredArgsConstructor
public class CodeService {

    private final RedisTemplate<String, Object> redisTemplate;

    public Code generateCodeByAnswerMessage(ChatMessage answerMessage) {

        Code code = Code.builder()
                .title(answerMessage.getTitle())
                .language(answerMessage.getLanguage())
                .content(answerMessage.getMessage())
                .summarization(answerMessage.getSummarization())
                .created_time(answerMessage.getSendTime())
                .course_id(answerMessage.getRoomId())
                .id(UUID.randomUUID().toString())
                .build();

        log.info("generate Code to be Saved in Redis From AnswerMessage: {}", code);

        return code;
    }

    /**
     * 강의 중에 나온 Code 저장
     *
     * @param courseUUID 강의 UUID
     * @param codeUUID   코드 UUID
     * @param saveCode   저장할 Code Class
     */
    public void saveCode(String courseUUID, String codeUUID, Code saveCode) {

        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();

        hashOperations.put(courseUUID, codeUUID, saveCode);
    }

    /**
     *
     * @param courseUUID
     * @return
     */
    public Map<String, Code> getAllCode(String courseUUID) {

        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();

        Map<String, Code> courseCodeMap = hashOperations.entries(courseUUID);

        return courseCodeMap;
    }

    public Code getCertainCode(String courseUUID, String codeUUID) {

        HashOperations<String, String, Code> hashOperations = redisTemplate.opsForHash();

        return hashOperations.entries(courseUUID).get(codeUUID);
    }
}
