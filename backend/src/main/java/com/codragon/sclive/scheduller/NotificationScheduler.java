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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NotificationScheduler {
//    private final Map<String, ThreadPoolTaskScheduler> schedulerMap = new ConcurrentHashMap<>();

    private ThreadPoolTaskScheduler scheduler;
    private List<String> cronList = new ArrayList<>();
    private List<FCMNoticeReqDto> requestDtos =  new ArrayList<>();
    private FirebaseMessaging firebaseMessaging;

    public NotificationScheduler() {
    }

    public void addSchedule(String cron, FCMNoticeReqDto fCMNoticeReqDto) {
        cronList.add(cron);
        requestDtos.add(fCMNoticeReqDto);
        if (scheduler != null) {
            scheduler.schedule(getRunnable(cron, fCMNoticeReqDto), getTrigger(cron));
        }
    }
    public void startScheduler() {
        scheduler = new ThreadPoolTaskScheduler();
        scheduler.initialize();
        for (int i = 0; i < cronList.size(); i++) {
            String cron = cronList.get(i);
            FCMNoticeReqDto fCMNoticeReqDto = requestDtos.get(i);
            scheduler.schedule(getRunnable(cron, fCMNoticeReqDto), getTrigger(cron));
        }
    }

    public void stopScheduler() {
        scheduler.shutdown();
    }

    private Runnable getRunnable(String cron, FCMNoticeReqDto fCMNoticeReqDto) {
        return () -> {
            System.out.println(new Date().toString());
            cronList.remove(cron);
            requestDtos.remove(fCMNoticeReqDto);
        };
    }

    private Trigger getTrigger(String cron) {
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
