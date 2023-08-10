package com.codragon.sclive.controller;

import com.codragon.sclive.dao.ReservationCreateDao;
import com.codragon.sclive.domain.HttpResult;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.ReservationCreateReqDto;
import com.codragon.sclive.dto.ReservationListResDto;
import com.codragon.sclive.dto.ReservationUpdateReqDto;
import com.codragon.sclive.service.ReservationService;
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

import java.util.List;

@Api(value = "예약 API", tags = {"Reservation"})
@Slf4j
@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    //예약 생성 : Access-Token, 방제목, 예약시간을 시작시간으로, isActive = 2, :예약상태
    @ApiOperation(value = "예약 생성", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<HttpResult> create(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestBody ReservationCreateReqDto reservationCreateReqDto){
        String email = user.getUserEmail();
        ReservationCreateDao reservationCreateDao = reservationCreateReqDto.reqToDto();
        reservationCreateDao.setOwnerEmail(email);
        reservationService.create(reservationCreateDao);

        HttpResult result = HttpResult.getSuccess();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    //예약 리스트 조회 : AccessToken -> email == isOwner && isActive == 2인 방들을 조회
    @ApiOperation(value = "예약 리스트 조회", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @GetMapping("/list")
    public ResponseEntity<HttpResult> list(@ApiIgnore @AuthenticationPrincipal UserEntity user){
        List<ReservationListResDto> reservationListResDtos = reservationService.list(user.getUserEmail());

        HttpResult result = HttpResult.getSuccess();
        result.setData(reservationListResDtos);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @ApiOperation(value = "예약 리스트 수정", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @PostMapping("/update")
    public ResponseEntity<HttpResult> update(@ApiIgnore @AuthenticationPrincipal UserEntity user, @RequestBody ReservationUpdateReqDto reservationUpdateReqDto){
        String email = user.getUserEmail();
        ReservationCreateDao reservationCreateDao = reservationUpdateReqDto.reqToDto();
        reservationCreateDao.setOwnerEmail(email);
        int res = reservationService.update(reservationCreateDao);

        HttpResult result;
        if(res==1){
            result = HttpResult.getSuccess();
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "예약 업데이트 실패");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    //예약 삭제 isActive = 3
    @ApiOperation(value = "예약, 시작 전인 회의 삭제", notes = "Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhb...형식으로 필요\n반환값 : \n")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    @DeleteMapping("/delete")
    public ResponseEntity<HttpResult> delete(@RequestParam String uuid){
        int res = reservationService.delete(uuid);

        HttpResult result;
        if(res == 1){
            result = HttpResult.getSuccess();
        } else{
            result = new HttpResult(HttpStatus.FORBIDDEN, HttpResult.Result.ERROR, "회의 삭제 실패");
        }
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
