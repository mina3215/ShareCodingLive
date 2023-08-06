package com.codragon.sclive.controller;

import com.codragon.sclive.dao.ConCreateDao;
import com.codragon.sclive.dao.ConEndDao;
import com.codragon.sclive.dao.ConJoinDao;
import com.codragon.sclive.domain.HttpResult;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.ConferenceCreateResDto;
import com.codragon.sclive.dto.ConferenceJoinReqDto;
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

    @ApiOperation(value = "방 생성", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n" +
            "{\n" +
            "  \"status\": \"OK\",\n" +
            "  \"result\": \"SUCCESS\",\n" +
            "  \"message\": \"SUCCESS\",\n" +
            "  \"data\": {\n" +
            "    \"uuid\": \"75a04f3c-cb7c-4e94-956b-e5e3b227166b\",\n" +
            "    \"link\": \"https://localhost:3000/75a04f3c-cb7c-4e94-956b-e5e3b227166b\"\n" +
            "}\n" +
            "}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<HttpResult> create(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String title) {
        ConCreateDao conCreateDao = new ConCreateDao();
        conCreateDao.setTitle(title);
        conCreateDao.setOwnerEmail(user.getUserEmail());
        ConferenceCreateResDto conferenceCreateResDto = conferenceService.create(conCreateDao);

        HttpResult result = HttpResult.getSuccess();
        result.setData(conferenceCreateResDto);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @ApiOperation(value = "방 참가", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n" +
            "{\n" +
            "  \"status\": \"OK\",\n" +
            "  \"result\": \"SUCCESS\",\n" +
            "  \"message\": \"SUCCESS\",\n" +
            "  \"data\": \"wss://i9d109.p.ssafy.io:4443?sessionId=75a04f3c-cb7c-4e94-956b-e5e3b227166b&token=tok_Ww6SNZLN7dYcNJNY\"\n" +
            "}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 403, message = "존재하지 않는 방"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/join")
    public ResponseEntity<HttpResult> join(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestBody ConferenceJoinReqDto conferenceJoinReqDto) {
        if (conferenceJoinReqDto.isOwner()) {
            conferenceService.update(conferenceJoinReqDto.getUuid());
        } else {
            if (conferenceService.find(conferenceJoinReqDto.getUuid()) != 1) {
                HttpResult result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "존재하지 않는 방");
                return ResponseEntity.status(result.getStatus()).body(result);
            }
        }

        ConJoinDao conJoinDao = new ConJoinDao();
        conJoinDao.setUuid(conferenceJoinReqDto.getUuid());
        conJoinDao.setEmail(user.getUserEmail());
        String token = null;        // conference_history 디비에 생성, openvidu 참가
        HttpResult result;
        try {
            token = conferenceService.join(conJoinDao);
            result = HttpResult.getSuccess();
            result.setData(token);
        } catch (Exception e) {
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, e.getMessage());
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "방 종료", notes = "방장이 방을 나가면 회의가 종료된다. 반환값 없음")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/end")
    public ResponseEntity<HttpResult> end(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestParam String uuid) {

        ConEndDao dao = new ConEndDao();
        dao.setUuid(uuid);
        dao.setEmail(user.getUserEmail());

        HttpResult result;
        int updateCnt = conferenceService.end(dao);
        if (updateCnt == 1) {
            result = HttpResult.getSuccess();
        } else {
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "회의 종료 실패");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
