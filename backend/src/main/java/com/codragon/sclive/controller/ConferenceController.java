package com.codragon.sclive.controller;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;
import com.codragon.sclive.domain.HttpResult;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.ConferenceCreateReqDto;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.dto.ConferenceJoinReqDto;
import com.codragon.sclive.dto.ConferenceStartReqDto;
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

import java.util.UUID;

@Api(value = "회의방 API", tags = {"Conference"})
@Slf4j
@RestController
@RequestMapping("/conference")
@RequiredArgsConstructor
public class ConferenceController {

    private final ConferenceService conferenceService;

    @ApiOperation(value = "방 생성", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n" +
            "로그인 되어 있는 사용자 계정으로 회의 방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<HttpResult> create(@ApiIgnore @AuthenticationPrincipal UserEntity user) { //@RequestBody ConferenceCreateReqDto conferenceCreateReqDto

        // 회의방 생성하는 로직이 일단 접혔음
        // Todo : 예약기능이 추가되면 로직이 많이 바뀔 예정
        // 예약기능 들어가면 여기서 회의방 생성 해야될듯?
//        ConCreateDao conCreateDao = new ConCreateDao();
//        conCreateDao.setTitle(conferenceCreateReqDto.getTitle());
//        conCreateDao.setStartTime(conferenceCreateReqDto.getStartTime());
//        conCreateDao.setOwnerEmail(user.getUserEmail());
//        ConferenceCreateResDto conferenceCreateResDto = conferenceService.create(conCreateDao);

        // 일단은 uuid와 링크만 생성해서 반환
        ConferenceCreateResDto conferenceCreateResDto = new ConferenceCreateResDto();
        String uuid = UUID.randomUUID().toString();
        conferenceCreateResDto.setUuid(uuid);
        String link = "https://localhost:3000/" + uuid;
        conferenceCreateResDto.setLink(link);
        HttpResult result = HttpResult.getSuccess();
        result.setData(conferenceCreateResDto);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 시작", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n" +
            "생성한 회의 시작")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/start")
    public ResponseEntity<HttpResult> start(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestBody ConferenceCreateReqDto conferenceCreateReqDto) {
        // 디비에 저장하고 initSession
        ConCreateDao dao = conferenceCreateReqDto.dtoTodao();
        dao.setOwnerEmail(user.getUserEmail());
        boolean res = conferenceService.start(dao);

        // 방장도 Join 하시오!! 여기서 안할거야
        HttpResult result;
        if(res){
            result = HttpResult.getSuccess();
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "회의 시작 중 오류 발생");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 참가", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n" +
            "uuid에 해당하는 방에 대해 로그인한 사용자를 참가시킨다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/join")
    public ResponseEntity<HttpResult> join(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid) {

        // conference_history 디비에 생성, openvidu 참가
        ConJoinDao conJoinDao = new ConJoinDao();
        conJoinDao.setUuid(uuid);
        conJoinDao.setEmail(user.getUserEmail());
        String token = conferenceService.join(conJoinDao);
        HttpResult result;
        if (token != null) {
            result = HttpResult.getSuccess();
            result.setData(token);
        } else {
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
    public ResponseEntity<HttpResult> end(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid) {

        ConEndDao dao = new ConEndDao();
        dao.setUuid(uuid);
        dao.setEmail(user.getUserEmail());
//        boolean ownerCheck = conferenceService.ownerCheck(dao);
//        if(ownerCheck){
//            // conference를 isActive = 0, endTime = 현재시각으로 설정
//            conferenceService.endConference(uuid);
//            result = HttpResult.getSuccess();
//        } else{
//            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "방장이 아닙니다.");
//        }

        HttpResult result;
        int updateCnt = conferenceService.end(dao);
        if(updateCnt==1){
            result = HttpResult.getSuccess();
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "회의 종료 실패");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
