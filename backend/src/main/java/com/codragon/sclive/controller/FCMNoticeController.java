package com.codragon.sclive.controller;

import com.codragon.sclive.dto.FCMNoticeReqDto;
import com.codragon.sclive.scheduller.NotificationScheduler;
import com.codragon.sclive.service.FCMNoticeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Api(value = "알림 컨트롤러", tags = {"Notification"})
@Slf4j
@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class FCMNoticeController {

    private final NotificationScheduler notificationScheduler;

    private final FCMNoticeService fcmNoticeService;

    @ApiOperation(value = "알림보내기")
    @PostMapping()
    public String sendNotificationByToken(@RequestBody FCMNoticeReqDto requestDto) {
        notificationScheduler.stopScheduler();
        try {
            Thread.sleep(1000);
            notificationScheduler.setRequestDto(requestDto);
            notificationScheduler.changeCronSet("0 56 17 09 08 ?");
            notificationScheduler.startScheduler();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

//        return fcmNoticeService.sendNotificationByToken(requestDto);
        return "Success";
    }

    @ApiOperation(value = "크론테스트")
    @GetMapping()
    public String cronTest(@RequestParam String time) {
        notificationScheduler.stopScheduler();
        String cron = "*/"+time+" * * * * *";

//        String cron  = "*/2 * * * * *";
        try {
            Thread.sleep(1000);
            notificationScheduler.changeCronSet(cron);
            notificationScheduler.startScheduler();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        return "Success";
    }
}