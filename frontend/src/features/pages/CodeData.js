const code_data = [
  {
    title: 'C++ 수업',
    codes: [
      { codeTitle: '더하기 코드', code: 'print(num1 + num2)', summarization: '요약 1', language: 'python' },
      { codeTitle: '빼기 코드', code: 'print(num1 - num2)', summarization: '요약 2', language: 'python' },
      { codeTitle: '나누기 코드', code: 'print(num1 / num2)', summarization: '요약 3', language: 'python' },
    ],
  },
  {
    title: '사용자 관리 코드',
    codes: [
      { codeTitle: '코드 제목 1', code: `cout << "Hello!" << end`, summarization: '요약 B', language: 'c' },
      {
        codeTitle: 'Socket으로 사용자 관리',
        code: `const recvMessage = (recv) => {
        if (recv.type === 'ENTER') {
          setMembers((prevMerbers) => [
            ...prevMerbers,
            { sender: recv.sender, members: recv.message},
          ]);
        }
        else if (recv.type === 'QUIT') {
          setMembers(members.filter(member => member !== recv.sender))
    
        }
        else if (recv.type === 'TALK') {
          setChats((prevChats) => [
            ...prevChats,
            { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},
          
          ]);
    
        }
        else if (recv.type === 'QUESTION') {
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime},
          
          ]);
    
        }
        else if (recv.type === 'CODE') {
          setCodes((prevCodes) => [
            ...prevCodes,
            { type: recv.type, sender: recv.sender, message: recv.message, time: recv.sendTime , title: recv.title, summarization: recv.summarization},
          
          ]);
    
        }
        
      };`,
        summarization: '요약 A',
        language: 'javascript',
      },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
  {
    title: '테스트 수업',
    codes: [
      { codeTitle: '제목 1', code: '코드 1', summarization: '요약 1', language: 'test' },
      { codeTitle: '제목 2', code: '코드 2', summarization: '요약 2', language: 'test' },
    ],
  },
];

export default code_data;
