package com.codragon.sclive.controller;

import com.codragon.sclive.dao.FCMNoticeReqDao;
import com.codragon.sclive.domain.UserEntity;
import com.codragon.sclive.dto.FCMNoticeReqDto;
import com.codragon.sclive.scheduller.NotificationScheduler;
import com.codragon.sclive.service.FCMNoticeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

@Api(value = "알림 컨트롤러", tags = {"Notification"})
@Slf4j
@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class FCMNoticeController {

    private final FCMNoticeService fcmNoticeService;

    @ApiOperation(value = "알림보내기")
    @PostMapping()
    public String sendNotificationByToken(@ApiIgnore @AuthenticationPrincipal UserEntity user, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") @RequestParam LocalDateTime reservationTime, @RequestParam String token) {
        String email = user.getUserEmail();
        FCMNoticeReqDao dao = new FCMNoticeReqDao();
        dao.setTargetEmail(email);
        dao.setReservationTime(reservationTime);
        dao.setToken(token);
        LocalDateTime date = reservationTime; // 설정할 시간을 가져온다.
        log.debug(date.toString());
        long delay = ChronoUnit.MILLIS.between(LocalTime.now(), LocalTime.of(date.getHour(), date.getMinute(), date.getSecond())); // 현재시각으로 부터 몇초뒤에 실행할지 계산한다.
//        long minutesof10 = 1000*60*60*10;
//        delay = Math.max(1000, delay-minutesof10); // 예약 시간 10분전에 알람을 설정한다.
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                fcmNoticeService.sendNotificationByToken(dao);
            }
        }, delay);
        return "Success";
    }

    @ApiOperation(value = "크론테스트")
    @GetMapping()
    public String cronTest() {
        FCMNoticeReqDao dao = new FCMNoticeReqDao();
        dao.setToken("eGD9j40IAAnHROA4_0MLJc:APA91bEfi_0XMrEdKXVwjWGFe4kPEY5spdMlCQQ3wtu9WDDvnCQjZraxQAbtyYDfn9S66pJhV7C30Km0FJom4Es78CJIdISnLs9EumpDBVVvXpCxBKvpvSDAiQYZfIxhkvJ8gvQfRKmf");
        fcmNoticeService.sendNotificationByToken(dao);
        return "Success";
    }
}