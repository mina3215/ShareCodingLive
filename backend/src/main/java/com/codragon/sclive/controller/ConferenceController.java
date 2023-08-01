package com.codragon.sclive.controller;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.domain.HttpResult;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.ConferenceCreateReqDto;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.service.ConferenceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "회의방 API", tags = {"Conference"})
@Slf4j
@RestController
@RequestMapping("/conference")
@RequiredArgsConstructor
public class ConferenceController {

    private final ConferenceService conferenceService;

    @ApiOperation(value = "방 생성", notes = "로그인 되어 있는 사용자 계정으로 회의 방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<HttpResult> create(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestBody ConferenceCreateReqDto conferenceCreateReqDto){ //title과 시작 시간 입력받음

        ConCreateDao conCreateDao = new ConCreateDao();
        conCreateDao.setTitle(conferenceCreateReqDto.getTitle());
        conCreateDao.setStartTime(conferenceCreateReqDto.getStartTime());
        conCreateDao.setOwnerEmail(user.getUserEmail());

        ConferenceCreateResDto conferenceCreateResDto = conferenceService.create(conCreateDao);

        HttpResult result = HttpResult.getSuccess();
        result.setData(conferenceCreateResDto);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 시작", notes = "생성한 회의 시작")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/start")
    public ResponseEntity<HttpResult> start(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid){
        conferenceService.start(uuid);
        // conference를 isActive = 1로 변경한다.
        // openvidu 연결

        // 방장 회의방 참가? 아니면 방장도 join으로?

        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 참가", notes = "uuid에 해당하는 방에 대해 로그인한 사용자를 참가시킨다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/join") // Todo : 참가자가 나갔다 들어왔다 할때 어떻게 처리할지
    public ResponseEntity<HttpResult> join(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid){
        // conference_history 생성
        // openvidu 참가
        String token = conferenceService.join(user.getUserEmail(), uuid);
        HttpResult result;
        if(token != null){
            result = HttpResult.getSuccess();
            result.setData(token);
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "토큰 생성 실패");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 종료", notes = "방장이 방을 나가면 회의가 종료된다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/end")
    public ResponseEntity<HttpResult> end(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid){
        // Todo :
        // conference를 isActive = 0으로 변경한다.
        // openvidu 종료? 연결 끊기
        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
    }



}
