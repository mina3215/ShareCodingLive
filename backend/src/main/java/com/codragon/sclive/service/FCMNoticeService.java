package com.codragon.sclive.service;

import com.codragon.sclive.dao.UserDao;
import com.codragon.sclive.dto.FCMNoticeReqDto;
import com.codragon.sclive.scheduller.NotificationScheduler;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FCMNoticeService {

    private final FirebaseMessaging firebaseMessaging;
//    private final UsersRepository usersRepository; firebase 토큰을 로그인시 저장해두고 FCM 보낼때 가져오기

    public String sendNotificationByToken(FCMNoticeReqDto requestDto) {
//        Optional<Users> user = usersRepository.findById(requestDto.getTargetUserId());
        UserDao user = new UserDao();//userService.getUserInfoByEmail(email);
        user.setEmail("hello");
        String firebaseToken = "dDiMx3JJwq5GCqD7kcBUZh:APA91bH9eGlgnYmiAANYb5-ZFl3c4ods16wwLVN7Ps13D42z8W3zr9fWKY_pa9AUFFwR5AKr1xYoOkwTYrzUVlj54UsNe7qbKDHgn9nPZbIv2Z415jBTamzQPmcLIX1wS4oJvg0PYwhJ";
        if (user != null) {
//            if (user.get().getFirebaseToken() != null) {
            if (firebaseToken != null) {
                Notification notification = Notification.builder()
                        .setTitle(requestDto.getTitle())
                        .setBody(requestDto.getBody())
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
                    return "알림을 성공적으로 전송했습니다. targetUserId=" + requestDto.getTargetUserId();
                } catch (FirebaseMessagingException e) {
                    e.printStackTrace();
                    return "알림 보내기를 실패하였습니다. targetUserId=" + requestDto.getTargetUserId();
                }
            } else {
                return "서버에 저장된 해당 유저의 FirebaseToken이 존재하지 않습니다. targetUserId=" + requestDto.getTargetUserId();
            }

        } else {
            return "해당 유저가 존재하지 않습니다. targetUserId=" + requestDto.getTargetUserId();
        }


    }
}
