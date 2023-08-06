package com.codragon.sclive.chat;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Slf4j
@SpringBootTest
class ChatGPTUtilTest {

    @Autowired
    ChatGPTUtil chatGPTUtil;

    String code = "```" +
            "public class Main {\n" +
            "\tpublic static void main(String[] args) throws Exception {\n" +
            "\t\tBufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n" +
            "\t\tBufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));\n" +
            "\t\tStringBuilder sb = new StringBuilder();\n" +
            "\t\tStringTokenizer st;\n" +
            "\t\tst = new StringTokenizer(br.readLine().trim());\n" +
            "\t\tint N = Integer.parseInt(st.nextToken());\n" +
            "\t\tint K = Integer.parseInt(st.nextToken());\n" +
            "\t\tint[] o = new int[N];\n" +
            "\t\tString line = br.readLine().trim();\n" +
            "\t\tfor(int i = 0; i < N; i++) {\n" +
            "\t\t\to[i] = line.charAt(i) - '0';\n" +
            "\t\t}\n" +
            "\t\tint max = 0, idx = 0;\n" +
            "\t\tfor(int i = 0; i < N - K; i++) {\n" +
            "\t\t\tmax = 0;\n" +
            "\t\t\tfor (int j = idx; j <= K + i; j++) {\n" +
            "\t\t\t\tif (o[j] > max) {\n" +
            "\t\t\t\t\tmax = o[j];\n" +
            "\t\t\t\t\tidx = j;\n" +
            "\t\t\t\t\tif(max == 9) {\n" +
            "\t\t\t\t\t\tbreak;\n" +
            "\t\t\t\t\t}\n" +
            "\t\t\t\t}\n" +
            "\t\t\t}\n" +
            "\t\t\tidx++;\n" +
            "\t\t\tsb.append(max);\n" +
            "\t\t}\n" +
            "\t\tbw.write(sb.append('\\n').toString());\n" +
            "\t\tbw.close();\n" +
            "\t}\n" +
            "}" +
            "```";

    @Test
    @DisplayName("코드 제목, 요약, 주석 달기")
    void getTitle() throws ExecutionException, InterruptedException {

        log.debug("prepare to send User's Code to ChatGPT");
        long start = System.currentTimeMillis();

        CompletableFuture<String> title = chatGPTUtil.getTitle(code);
        CompletableFuture<String> summarize = chatGPTUtil.getSummarize(code);
        CompletableFuture<String> comment = chatGPTUtil.addComment(code);

        CompletableFuture.allOf(title, summarize, comment).join();

        log.info("Elapsed time: " + (System.currentTimeMillis() - start));
        log.info("title: {}", title.get());
        log.info("summarize: {}", summarize.get());
        log.info("comment: {}", comment.get());
    }
}