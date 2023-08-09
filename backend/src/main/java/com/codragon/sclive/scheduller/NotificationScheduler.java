package com.codragon.sclive.scheduller;

import com.codragon.sclive.dto.FCMNoticeReqDto;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.time.LocalDateTime;

@Component
public class NotificationScheduler {
    private ThreadPoolTaskScheduler scheduler;
    private String cron = "0 0 17 09 08 ?";
    private FCMNoticeReqDto requestDto = null;
    private FirebaseMessaging firebaseMessaging;

    public NotificationScheduler() {
    }

    public void startScheduler() {
        scheduler = new ThreadPoolTaskScheduler();
        scheduler.initialize();
        // scheduler setting
        scheduler.schedule(getRunnable(), getTrigger());
    }

    public void changeCronSet(String cron) {
        this.cron = cron;
    }

    public void setRequestDto(FCMNoticeReqDto fcmNoticeReqDto){
        this.requestDto = fcmNoticeReqDto;
    }

    public void stopScheduler() {
        scheduler.shutdown();
    }

    private Runnable getRunnable() {
        // do something
        return () -> {
            System.out.println("!!!!!!!!!!!!!"+this.requestDto);
        };
    }

    private Trigger getTrigger() {
        // cronSetting
        return new CronTrigger(cron);
    }

    @PostConstruct
    public void init() {
        startScheduler();
    }

    @PreDestroy
    public void destroy() {
        stopScheduler();
    }
}
