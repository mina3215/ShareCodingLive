package com.codragon.sclive.chat;

import io.github.flashvayne.chatgpt.service.ChatgptService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@Slf4j
@SpringBootTest
class ChatGPTUtilTest {

    @Autowired
    ChatGPTUtil chatGPTUtil;

    @Autowired
    ChatgptService chatgptService;

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
            "}```";

    String code1 = "axios({\n" +
            "    method: \"post\",\n" +
            "    url: \"https://i9D109.p.ssafy.io:8094/user/login\",\n" +
            "    data: {\n" +
            "        \"email\": \"ssafy\",\n" +
            "        \"password\": \"ssafy\"\n" +
            "    },\n" +
            "}).then((res) => {\n" +
            "    console.log(res); // 에러코드같은거 보려고 일부로 넣는 편이다.\n" +
            "    let headers = res.headers;\n" +
            "    console.log(\"headers: \", headers);\n" +
            "    console.log(headers[\"access-token\"]);\n" +
            "});";

    String code2 = "```" +
            "# 일반적인 라우트 방식입니다.\n" +
            "@app.route('/board')\n" +
            "def board():\n" +
            "    return \"그냥 보드\"\n" +
            "\n" +
            "# URL 에 매개변수를 받아 진행하는 방식입니다.\n" +
            "@app.route('/board/<article_idx>')\n" +
            "def board_view(article_idx):\n" +
            "    return article_idx\n" +
            "\n" +
            "# 위에 있는것이 Endpoint 역활을 해줍니다.\n" +
            "@app.route('/boards',defaults={'page':'index'})\n" +
            "@app.route('/boards/<page>')\n" +
            "def boards(page):\n" +
            "    return page+\"페이지입니다.\"```";

    String code3 = "안녕하세요 반가워요 저는 사실 코드가 아닙니다.";

    String code4 = "```" +
            "void main()\n" +
            "{\n" +
            "    char c;\n" +
            "    char buffer[100] = { 0 };\n" +
            "    char buffer2[100] = { 0 };\n" +
            "    int count = 0;\n" +
            "    int count2 = 0;\n" +
            " \n" +
            "    printf(\"Enter a string want to be acronym : \");\n" +
            "    while (1)\n" +
            "    {\n" +
            "        for (; (c = getchar()) != '\\n';)\n" +
            "        {\n" +
            "            buffer[count] = c;\n" +
            "            count++;\n" +
            "        }\n" +
            "        break;\n" +
            "    }\n" +
            " \n" +
            "    count = 0;\n" +
            " \n" +
            "    while (buffer[count] != '\\0')   \n" +
            "    {\n" +
            "        if (isalpha(buffer[count]))     // buffer 값을 늘려가다가 알파벳을 발견하면\n" +
            "        {\n" +
            "            if (islower(buffer[count]))   // buffer2에 대문자 값을 입력한다\n" +
            "            {\n" +
            "                buffer2[count2] = toupper(buffer[count]);\n" +
            "                count2++;\n" +
            "            }\n" +
            "            else\n" +
            "            {\n" +
            "                buffer2[count2] = buffer[count];\n" +
            "                count2++;\n" +
            "            }\n" +
            "            for (; !isspace(buffer[count]);)  // 다음 공백이 나올 때까지 count를 증가시킨다\n" +
            "            {\n" +
            "                count++;\n" +
            "                if (buffer[count] == '\\0')    // buffer의 끝부분에 도달하면 루프 탈출\n" +
            "                    break;\n" +
            "            }\n" +
            "        }\n" +
            "        count++;\n" +
            "    }\n" +
            " \n" +
            "    printf(\"Acronym String is : \\\"%s\\\"\\n\", buffer2);\n" +
            " \n" +
            "}```";
}