package com.codragon.sclive.service;

import com.codragon.sclive.chat.CodeUtil;
import com.codragon.sclive.domain.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

//    //채팅방 생성
//    public ChatRoom createRoom(String roomId) {
//        ChatRoom chatRoom = ChatRoom.create(roomId);
//        return chatRoom;
//    }

    private final CodeUtil codeUtil;

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        String text = message.getMessage(); //사용자가 보내고자 하는 실제 메시지

        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
            // ENTER TYPE이면 입장 메시지를 작성
            message.setMessage(message.getSender() + "님이 입장하였습니다.");
        } else if (text.length() < 3) {
            //채팅 길이가 3글자 미만이면 일반 채팅으로 타입 지정
            message.setType(ChatMessage.MessageType.TALK);
        } else {
            // 그 외는 메시지 시작 3글자, 끝 3글자를 가져온다.
            String start = text.substring(0, 3);
            String end = text.substring(message.getMessage().length() - 3, message.getMessage().length());

            //메시지의 기본 타입을 일반 채팅으로 지정
            message.setType(ChatMessage.MessageType.TALK);

            // ```code``` 이면 코드
            if ("```".equals(start) && "```".equals(end)) {
                message.setType(ChatMessage.MessageType.CODE); // 타입 지정
                text = text.substring(3, text.length() - 3); // 구분 문자 제거
                message.setMessage(text);

                // Todo : 코드이기 때문에 text를 redis에 저장 -> 문제발생
//                codeUtil.saveCode(message);
            }
            // ?질문? 이면 질문
            else if ('?' == start.charAt(0) && '?' == end.charAt(2)) {
                message.setType(ChatMessage.MessageType.QUESTION); //타입 지정
                text = text.substring(1, text.length()); //구분문자 제거, 끝의 ?는 남겨둔다.
                message.setMessage(text);
            }
        }
        return message;
    }
}
