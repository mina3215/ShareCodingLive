package com.codragon.sclive.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.CompletableFuture;


@Slf4j
@Component
@RequiredArgsConstructor
public class ChatGPTUtil {

    private String API_KEY = "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";
    private static final String ENDPOINT = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public CompletableFuture<ResponseEntity<ChatGptResponse>> getTitle(String code) {
        StringBuilder question = new StringBuilder("Could you please make a title for the code snippet below?\n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());

        log.debug("start to generate code Title");
        return this.askQuestion(request);
    }

    @Async
    public CompletableFuture<ResponseEntity<ChatGptResponse>> addComment(String code) {
//        StringBuilder question = new StringBuilder("이 코드에 주석을 달아주세요. 코드 스니펫으로 사용언어를 표기하여 보내주세요. \n");
        StringBuilder question = new StringBuilder("이 코드에 주석을 달아주세요. 그리고 앞에 어느 언어인지 표기해줘. \n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());
        log.debug("start to generate code Comment");
        return this.askQuestion(request);
    }

    @Async
    public CompletableFuture<ResponseEntity<ChatGptResponse>> getSummarize(String code) {
        StringBuilder question = new StringBuilder("아래의 코드에 대한 한줄 평을 남겨주세요. : \n");
        question.append(code);
        QuestionRequest request = new QuestionRequest();
        request.setQuestion(question.toString());
//        String answer = response.getChoices().get(0).getMessage().content;
        log.debug("start to generate code Summarization");
        return this.askQuestion(request);
    }


    public HttpEntity<ChatGptRequest> buildHttpEntity(ChatGptRequest chatGptRequest) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.parseMediaType(ChatGptConfig.MEDIA_TYPE));
        httpHeaders.add(ChatGptConfig.AUTHORIZATION, ChatGptConfig.BEARER + API_KEY);
        return new HttpEntity<>(chatGptRequest, httpHeaders);
    }

    @Async
    public CompletableFuture<ResponseEntity<ChatGptResponse>> getResponse(HttpEntity<ChatGptRequest> chatGptRequestHttpEntity) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(60000);
        //답변이 길어질 경우 TimeOut Error가 발생하니 1분정도 설정해줍니다.
        requestFactory.setReadTimeout(60 * 1000);   //  1min = 60 sec * 1,000ms
        restTemplate.setRequestFactory(requestFactory);

        ResponseEntity<ChatGptResponse> responseEntity = restTemplate.postForEntity(
                ChatGptConfig.CHAT_URL,
                chatGptRequestHttpEntity,
                ChatGptResponse.class);

        return CompletableFuture.completedFuture(responseEntity);
    }

    public CompletableFuture<ResponseEntity<ChatGptResponse>> askQuestion(QuestionRequest questionRequest) {
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
