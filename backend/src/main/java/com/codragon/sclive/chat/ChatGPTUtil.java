package com.codragon.sclive.chat;


import com.codragon.sclive.config.ChatGptConfig;
import com.codragon.sclive.domain.Code;
import io.github.flashvayne.chatgpt.service.ChatgptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatGPTUtil {

    private String API_KEY = "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";
    private static final String ENDPOINT = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getTitle(String code){
        StringBuilder question = new StringBuilder("Could you please make a title for the code snippet below?\n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());
        ChatGptResponse response = this.askQuestion(request);
        String answer = response.getChoices().get(0).getMessage().content;
        return answer;
    }

    public String addComment(String code){
        StringBuilder question = new StringBuilder("이 코드에 주석을 달아주세요. 코드 스니펫으로 사용언어를 표기하여 보내주세요. \n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());
        ChatGptResponse response = this.askQuestion(request);
        String answer = response.getChoices().get(0).getMessage().content;
        return answer;
    }

    public String getSummarize(String code) {
        StringBuilder question = new StringBuilder("아래의 코드에 대한 한줄 평을 남겨주세요. : \n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());
        ChatGptResponse response = this.askQuestion(request);
        String answer = response.getChoices().get(0).getMessage().content;
        return answer;
    }


    public HttpEntity<ChatGptRequest> buildHttpEntity(ChatGptRequest chatGptRequest){
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.parseMediaType(ChatGptConfig.MEDIA_TYPE));
        httpHeaders.add(ChatGptConfig.AUTHORIZATION, ChatGptConfig.BEARER + API_KEY);
        return new HttpEntity<>(chatGptRequest, httpHeaders);
    }

    public ChatGptResponse getResponse(HttpEntity<ChatGptRequest> chatGptRequestHttpEntity){
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(60000);
        //답변이 길어질 경우 TimeOut Error가 발생하니 1분정도 설정해줍니다.
        requestFactory.setReadTimeout(60 * 1000);   //  1min = 60 sec * 1,000ms
        restTemplate.setRequestFactory(requestFactory);

        ResponseEntity<ChatGptResponse> responseEntity = restTemplate.postForEntity(
                ChatGptConfig.CHAT_URL,
                chatGptRequestHttpEntity,
                ChatGptResponse.class);

        return responseEntity.getBody();
    }
    public ChatGptResponse askQuestion(QuestionRequest questionRequest){
        List<ChatGptMessage> messages = new ArrayList<>();
        messages.add(ChatGptMessage.builder()
                .role(ChatGptConfig.ROLE)
                .content(questionRequest.getQuestion())
                .build());
        return this.getResponse(
                this.buildHttpEntity(
                        new ChatGptRequest(
                                ChatGptConfig.CHAT_MODEL,
                                ChatGptConfig.MAX_TOKEN,
                                ChatGptConfig.TEMPERATURE,
                                ChatGptConfig.STREAM,
                                messages
                        )
                )
        );
    }
}
