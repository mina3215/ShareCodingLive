package com.codragon.sclive.chat;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;


@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ParticipantServiceTest {

    @Autowired
    ParticipantService participantService;

    final String roomId = "foo";

    @Test
    @Order(1)
    void joinParticipant() {

        participantService.joinParticipant(roomId, "김싸피");
        participantService.joinParticipant(roomId, "박싸피");
        participantService.joinParticipant(roomId, "최싸피");
        participantService.joinParticipant(roomId, "이싸피");
    }

    @Test
    @Order(2)
    void leaveParticipant() {
        participantService.leaveParticipant(roomId, "최싸피");
    }

    @Test
    @Order(3)
    void getAllParticipantInCurrentRoom() {
        Set<String> allParticipants = participantService.getAllParticipantInCurrentRoom(roomId);
        System.out.println("allParticipants = " + allParticipants);
    }
}