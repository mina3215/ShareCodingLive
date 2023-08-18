# 💻 쉐코라 ( Share Coding Live )

## 🌈쉐코라 소개 / 시연 영상🌈
https://www.youtube.com/watch?v=od30ifCdaBc

- ## 📑 의의

  > 코로나로 급격하게 상승하던 비대면 수업 수요가 코로나 종식과 함께 사그러 들고는 있지만 여전히 비대면 수업에 대한 수요는 그치지 않고 있습니다. 현존하는 화상 서비스에는 없는 편의 기능을 추가한 쉐코라는 좀 더 코딩 수업에 최적화된 서비스를 제공합니다.

- ## 📅 프로젝트 기간 - 2023.07.10 ~ 2021.08.18

- ## 👉 쉐코라 서비스 화면

- ### 회원관리
  1. 회원가입
  ![회원가입](/pictures/sclive_gifs/회원가입.gif)
  2. 로그인
     ![로그인](/pictures/sclive_gifs/로그인.gif)
- ### 마이페이지

  1. 닉네임 변경
     ![닉네임_변경](/pictures/sclive_gifs/닉네임_변경.gif)
  2. 비밀번호 변경
     ![비밀번호_변경](/pictures/sclive_gifs/비밀번호_변경.gif)
  3. 강의 및 코드 기록
     ![강의_기록](/pictures/sclive_gifs/강의_기록.gif)

- ### 회의방
  1. 강의 예약
     ![회의_예약](/pictures/sclive_gifs/회의_예약.gif)
  2. 강의 생성
     ![강의_생성](/pictures/sclive_gifs/강의_생성.gif)
  3. 강의 채팅방 (일반채팅, 코드채팅, 질문채팅)
     ![채팅창](/pictures/sclive_gifs/채팅창.gif)
  4. 강의 화면 공유
     ![화면공유](/pictures/sclive_gifs/OCR.gif)
  5. 손들기
![손들기](/pictures/sclive_gifs/화면공유.gif)
  6. OCR
![OCR](/pictures/sclive_gifs/OCR.gif)
  7. 원격 접속
     ![원격](/pictures/sclive_gifs/원격.gif)

- ## 🖥️ 개발 환경

---

- 🛠 **Backend**
  - Spring Boot
  - MySql 
  - Redis
  - JWT
  - Spring Security
  - NodeJS


- 🛠 **Frontend**

  - Visual Studio Code
  - React.js 18.2.0
  - react-bootstrap 2.8.0
  - Material-UI
  - redux-toolkit 1.9.5
  - redux 8.1.1


- 🛠 **Web RTC**
  - openvidu 2.28.0


- 🛠 **Pose Detection**
  - fingerpose
  - tensorflow


- 🛠 **OCR / SCREEN CAPTURE**
  - tesseract.js
  - html2canvas


- 🛠 **CI/CD**
  - aws ec2
  - aws eks (k8s)
  - aws cloudWatch
  - docker
  - jenkins
  - grafana
  - cAdivsor
  - prometheus

### 🧱 서비스 아키텍처

---

![아키텍처1](/pictures/아키텍처/아키텍처1.png)
![아키텍처2](/pictures/아키텍처/아키텍처2.png)
![아키텍처3](/pictures/아키텍처/아키텍처3.png)

### ❗ 기술 특이점

---
- 원격 접속 (Robot.js)
  > - Robot.js를 이용해 사용자 PC의 키보드와 마우스를 원격 조종 하는 서비스를 구현하였습니다.

- WebRTC (Openvidu)

  > - 화면상에 보이는 글자를 캡쳐하고 이를 OCR로 인식해 text 파일로 추출하는 기능을 구현하였습니다.
  > - 사용자가 화면에서 손을 들면 tesorflow를 이용하여 동작을 인식하는 손들기 기능을 구현하였습니다.
  > - 강의를 생성하며 생긴 링크를 공유하여 이용자가 강의에 참여할 수 있게 구현하였습니다.

- redux-toolkit

  > 프론트엔드 구현시에는 React와 redux-toolkit을 이용하여 Ducks Pattern 기반 상태 관리를 하였습니다.

- Docker

  > - 도커 네트워크로 테스트 분류에 따른 NAT를 구성하여 운영하였습니다.
  > - Docker Volume을 이용하여 DB 데이터 보존, 도커 compose를 사용하여 grafana에 프로메테우스를 실행, cAdvisor와 프로메테우스를 사용하여 부하테스트 진행하였습니다.

- 쿠버네티스 (eks)
  
  > - horizontal autoscale, verticle autoscale, cluster autoscale 적용하였습니다. 
  > - cloudwatch를 사용하여 부하테스트 진행하였고, DB 구성에 EBS 사용했습니다.
  
- DB 이중화

  > xtrabackup과 statefullset, NodePort, clusterIP,  사용하여 MySql 이중화 

### 👨‍👩‍👧 협업 툴

---

- Git
- Jira
- Notion
- Mattermost
- Webex

### API 명세서

---

![API01](/api/API01.png)
![API01](/api/API02.png)
![API01](/api/API03.png)
![API01](/api/API04.png)

### ✨코드 컨벤션

---

```
### 함수, 변수명

- 함수
    - 첫번째는 동사로
    - numOfSockets 하지 말고 numberOfSockets
- 변수 → 명사
- INT A, B, C 하지 말기
- 카멜 케이스

### SQL

- * 쓰지 말고 다 써주기
- from member면 첫머리 따기 m으로

### 함수에 파라미터 thows

- 인텔리제이 컨벤션 설정 찾아보자!
- 파라미터에 1개당 줄바꿈 에외 처리할거면 마지막 파라미터에 이어서 쓰기

[인텔리제이 자바 프로젝트 코딩 컨벤션 적용하기 (velog.io)](https://velog.io/@nefertiri/%EC%9D%B8%ED%85%94%EB%A6%AC%EC%A0%9C%EC%9D%B4-%EC%9E%90%EB%B0%94-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%BD%94%EB%94%A9-%EC%BB%A8%EB%B2%A4%EC%85%98-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

### if {}, for {}

- 한줄이어도 if() {
- } 이렇게 쓰기

### Lombok

- @Data 쓰지 말기

### return Arguments

- return new A() 쓰지말고
- A a = new A()
- return a 쓰기

### 패키지명 컨벤션

- domain
- controller
- service
- mapper (마이바티스), repository(JPA)
- config → 설정파일
- dto
```

### ✨Git 컨벤션

---

```
- [기능]  -  기능 서술
- [버그] - 버그 발생 시 사용
- [문서] - README.md 수정
- [이동] - 문서 이동 시 사용
    - `[이동] ArticleService → BoardService`
- [이름] - 파일 이름 변경시 사용
    - `[이동] [Hello.java](http://Hello.java) → Hi.java`
- [추가] - lib 추가 시 사용
    - [추가] myBatis 추가
- [스타일] - 코드 스타일 수정 시 사용
- [리팩토링] - 함수 분리 등등등, 코드 리뷰 후 등등등
- [테스트] - 테스트 케이스 작성
```

### 💡Git Flow 브랜치 전략

---

- Git Flow model을 사용하고, Git 기본 명령어 사용한다.

- Git Flow 사용 브랜치

- Git Flow 진행 방식

### 👨‍👩‍👧 Jira

---

협업 및 일정, 업무 관리를 위해 Jira를 이용하였습니다. 매주 월요일 오전 회의에서 한 주동안 진행되어야 할 주 단위 계획을 짜고, 진행할 이슈들을 스프린트를 만들어 등록했습니다. 스프린트는 일주일 단위로 진행하였습니다.

### 👨‍👩‍👧 Notion

---

모두가 봐야할 공지, 함께 공부해야 할 링크 등을 모아 관리했습니다. 회의 기록 및 의견들은 항상 추가하고 복기 할 수 있게 하였고, 공통으로 보아야하는 컨벤션 및 스케쥴 할일 등은 날짜별로 볼 수 있도록 정리하였습니다.

### 👨‍👩‍👧 Scrum

---

매일 아침 9시에 오늘 해야 할 일, 진도, 도움이 필요한 점을 꼼꼼히 공유하여 팀원 간의 소통에 에러가 없도록 하였습니다.

### ✨ ER Diagram

---


### 😃 팀원 역할

---

- **팀장 김민수 [BE]**
  - jwt를 이용한 회원관리 구현
  - Redis를 사용한 데이터 저장 구현


- **진희솜 [BE]**
  - 운영과 배포
  - jwt 구현
  - robot.js를 이용한 원격 접속 구현
  - openvidu 서버 구축


- **김유정 [BE]**
  - 회원관리, 회의방 생성 백 로직 구현
  - websocket과 stomp를 이용한 채팅 구현
  - chatGPT를 이용한 코드 해석 서비스 구현
  - DB 생성 및 구조 구축


- **정재욱 [FE]**
  - 회원관리 프론트 구현
  - 메인 페이지 및 전반적인 스타일 CSS 및 피그마
  - 화면 캡쳐 및 OCR 기능 구현
  - 홈 화면 컴포넌트 라우팅 및 구조 구성
  - styled-component와 material-ui를 통한 css 스타일링


- **박단비 [FE]**
  - 채팅 구현(socketJS, stomp)
  - 입력창 자동 완성, 예약 생성/수정/삭제/조회
  - 참가자 목록 조회 및 손 든 사람 구분
  - UCC 출연
  - 시연 발표


- **박민아 [FE]**
  - webrtc 전반 ( mediastream, openvidu, tensorflow )
  - 코드 기록 기능 구현 ( css, redux-toolkit )




