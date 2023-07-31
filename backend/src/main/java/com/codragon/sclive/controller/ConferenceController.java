package com.codragon.sclive.controller;

import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.ConferenceCreateReqDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Api(value = "회의방 API", tags = {"Conference"})
@Slf4j
@RestController
@RequestMapping("/conference")
public class ConferenceController {

    @ApiOperation(value = "방 생성", notes = "로그인 되어 있는 사용자 계정으로 회의 방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<String> create(@AuthenticationPrincipal UserEntity user, @RequestBody ConferenceCreateReqDto conferenceCreateReqDto){ //title과 시작 시간 입력받음
        // 서비스에서 방 생성 로직 처리
        // 결과로 방 링크 반환
        String uuid = "";
        String link = "https://sclive/join/room/"+uuid;
        return ResponseEntity.status(200).body(link);
    }

    @ApiOperation(value = "방 시작", notes = "생성한 회의 시작")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/start")
    public ResponseEntity<String> start(@AuthenticationPrincipal UserEntity user, @RequestParam String link){
        // conference를 isActive = 1로 변경한다.
        // openvidu 연결??
        // 방장 회의방 참가? 아니면 방장도 join으로?
        return ResponseEntity.status(200).body("방장이메일");
    }

    @ApiOperation(value = "방 참가", notes = "uuid에 해당하는 방에 대해 로그인한 사용자를 참가시킨다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/join") // Todo : 참가자가 나갔다 들어왔다 할때 어떻게 처리할지
    public ResponseEntity<String> join(@AuthenticationPrincipal UserEntity user, @RequestParam String link){
        // conference_history 생성
        // openvidu 참가?
        return ResponseEntity.status(200).body("SUCCESS");
    }

    @ApiOperation(value = "방 종료", notes = "방장이 방을 나가면 회의가 종료된다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/end")
    public ResponseEntity<String> end(@AuthenticationPrincipal UserEntity user, @RequestParam String uuid){
        // conference를 isActive = 0으로 변경한다.
        // openvidu 종료? 연결 끊기
        return ResponseEntity.status(200).body("SUCCESS");
    }



}
