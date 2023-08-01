package com.codragon.sclive.service;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
@Slf4j
@SpringBootTest
@DisplayName("Conference")
class ConferenceServiceImplTest {

    @Test
    void uuid_test(){
        log.debug(UUID.randomUUID().toString());
    }
}