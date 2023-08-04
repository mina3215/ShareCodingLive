package com.codragon.sclive.chat;

import com.codragon.sclive.domain.Code;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;


@Slf4j
@SpringBootTest
class CodeServiceTest {

    @Autowired
    CodeService codeService;

    String getRandomUUID() {
        return UUID.randomUUID().toString();
    }

//    final String Course_UUID = getRandomUUID();
    final String Course_UUID = "a5270379-e601-43e8-95b4-aed4974bcda0";
//    final String Code_UUID = getRandomUUID();
    final String Code_UUID = "45c3aab3-4328-4ca7-9a7c-c76653c968e7";

    @Test
    @Order(1)
    void saveCode() {

        log.info("======= 코드 저장 =======");
        log.info("강의: {}", Course_UUID);
        log.info("코드: {}", Code_UUID);

        Code saveCode = Code.builder()
                .course_id(Course_UUID)
                .title("코드 제목")
                .content("코드 내용")
                .created_time(new Date().toString())
                .summarization("코드 요약")
                .build();

        codeService.saveCode(Course_UUID, Code_UUID, saveCode);
    }

    @Test
    @Order(2)
    void getAllCode() {

        Map<String, Code> codeMap = codeService.getAllCode(Course_UUID);
        log.info("codeMap: {}", codeMap.toString());
        log.info("code: {}", codeMap.get(Code_UUID));
        log.info("code: {}", codeService.getCertainCode(Course_UUID, Code_UUID));
    }
}