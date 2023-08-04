package com.codragon.sclive.chat;

import com.codragon.sclive.domain.Code;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;


@Slf4j
@Component
@RequiredArgsConstructor
public class CodeService {

    private final RedisTemplate<String, Object> redisTemplate;

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
}
