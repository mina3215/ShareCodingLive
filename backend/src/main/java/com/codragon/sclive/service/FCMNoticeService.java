package com.codragon.sclive.service;

import com.codragon.sclive.dao.FCMNoticeReqDao;
import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.FCMNoticeReqDto;
import com.codragon.sclive.scheduller.NotificationScheduler;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class FCMNoticeService {

    private final FirebaseMessaging firebaseMessaging;
    // 토큰은 redis에 저장

    public String sendNotificationByToken(FCMNoticeReqDao reqDao) {
        log.debug("sendNotification");
//       String firebaseToken = "dDiMx3JJwq5GCqD7kcBUZh:APA91bH9eGlgnYmiAANYb5-ZFl3c4ods16wwLVN7Ps13D42z8W3zr9fWKY_pa9AUFFwR5AKr1xYoOkwTYrzUVlj54UsNe7qbKDHgn9nPZbIv2Z415jBTamzQPmcLIX1wS4oJvg0PYwhJ";
//        String firebaseToken = "f9lau0jxv_HqebClOdmiYA:APA91bHQ56lueFIeT9jHy16lQUy7K5i4SXKkY7XUOkoVSCD4USwGZkjR3vcMpaTfKoiRihNnuyVD7CaGlvFa21KJeGBT5OBr2YvOMYrLHYJnN-t8pFUmRWtPnuDeDPksyae6cikNDHQA";
        String firebaseToken = reqDao.getToken();//tokens.get(reqDao.getTargetEmail());
        if (reqDao != null) {
//            if (user.get().getFirebaseToken() != null) {
            if (firebaseToken != null) {
                Notification notification = Notification.builder()
                        .setTitle("쉐코라 예정 회의 알림")
                        .setBody("예정된 회의가 다가왔습니다. 회의를 시작해 주세요")
                         .setImage("https://ifh.cc/g/KOwySm.png")
                        .build();

                Message message = Message.builder()
//                        .setToken(user.get().getFirebaseToken())
                        .setToken(firebaseToken)
                        .setNotification(notification)
                        // .putAllData(requestDto.getData())
                        .build();

                try {
                    firebaseMessaging.send(message);
                    return "알림을 성공적으로 전송했습니다. targetUserId=" + reqDao.getTargetEmail();
                } catch (FirebaseMessagingException e) {
                    e.printStackTrace();
                    return "알림 보내기를 실패하였습니다. targetUserId=" + reqDao.getTargetEmail();
                }
            } else {
                return "서버에 저장된 해당 유저의 FirebaseToken이 존재하지 않습니다. targetUserId=" + reqDao.getTargetEmail();
            }

        } else {
            return "해당 유저가 존재하지 않습니다. targetUserId=" +reqDao.getTargetEmail();
        }


    }

}
