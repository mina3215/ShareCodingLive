package com.codragon.sclive.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Component;

import java.util.Set;


@Slf4j
@Component
@RequiredArgsConstructor
public class ParticipantService {

    private final RedisTemplate<String, String> redisTemplate;

    public void joinParticipant(String roomId, String newParticipant) {

        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
        log.debug("new Participant: {} in ROOM {}", newParticipant, roomId);

        setOperations.add(roomId, newParticipant);
    }

    public void leaveParticipant(String roomId, String leaveParticipant) {

        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
        log.debug("leave Participant: {} in ROOM {}", leaveParticipant, roomId);

        setOperations.remove(roomId, leaveParticipant);
    }

    public Set<String> getAllParticipantInCurrentRoom(String roomId) {

        SetOperations<String, String> setOperations = redisTemplate.opsForSet();

        Set<String> participants = setOperations.members(roomId);
        log.debug("Participant: {} in ROOM {}", participants, roomId);

        return participants;
    }
}
