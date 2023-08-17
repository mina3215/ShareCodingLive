import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

// import { Button } from '@mui/material';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// 복사 이모티콘
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const SummaryInlineStyle = {
  // textShadow: 'none',
  marginTop: '20px',
  borderRadius: '10px',
  fontSize: '14px',
  backgroundColor: '#c3d6f2',
  width: '19vw',
  height: '20vh',
  overflow: 'auto',
  padding: '15px',
};

const SyntaxInlineStyle = {
  borderRadius: '10px',
  fontSize: '14px',
  backgroundColor: '#c3d6f2',
  width: '19vw',
  height: '20vh',
  padding: '30px',
};

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#3d4146',
  borderRadius: '10px',
  marginBottom: '20px',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'Center',
  backgroundColor: '#62676e',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CodeTab = (props) => {
  const [expanded, setExpanded] = React.useState('');

  // 이거는 눌렀을때 아코디언 열리게 하기 위한 함수 중 하나
  const handleChange = (panel) => (event, newExpanded) => {
    console.log(newExpanded);
    setExpanded(newExpanded ? panel : false);
  };

  // 코드 복사하는 함수
  const handleCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  return (
    <div>
      <div>
        {props.messages.map((message, index) =>
          message.type === 'CODE' ? (
            <Accordion
              key={index}
              expanded={expanded === `message_${index}`}
              onChange={handleChange(`message_${index}`)}
            >
              {/* 제목 표시 */}
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>{message.title}</span>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      marginTop: '5px',
                      marginLeft: '5px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#748aaa' }}>{message.sender}</span>
                    <span style={{ color: '#c6d2e3', fontSize: '14px', marginLeft: '20px' }}>{message.time}</span>
                  </div>
                </div>
              </AccordionSummary>
              {/* 코드 본문 표시(아코디언 펼쳐지면보여질 내용) */}
              <AccordionDetails>
                {/* FIXME: 질문 코드 창 예쁘게, 사이즈 줄이면 따라서 움직이게 */}
                {/* FIXME: textarea 코드 모아보기에서는 수정 안되게 */}
                {/* FIXME: 코드 복사 버튼 만들기 */}
                {/* FIXME: 코드 복사 기능 */}
                <div>
                  {/* <SyntaxHighlighter language="javascript" style={docco}>
                    <textarea name="" id="" cols="30" rows="10">{message.message}</textarea>
                  </SyntaxHighlighter> */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block', // 컨테이너 크기를 내용에 맞게 조절
                    }}
                  >
                    {/* 복사 버튼 */}
                    <ContentCopyIcon
                      size="small"
                      variant="outlined"
                      onClick={() => handleCopy(message.message)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '2px',
                        minWidth: '5px', // 원하는 크기로 조절
                        minHeight: '5px',
                      }}
                    />

                    {/* textarea는 defaultValue 안에 값 줘야지 console에 에러가 안뜸 */}
                    {console.log('언어: ', message.language)}
                    <div>
                      <SyntaxHighlighter customStyle={SyntaxInlineStyle} language={message.language} PreTag="div">
                        {message.message}
                      </SyntaxHighlighter>
                      <div style={SummaryInlineStyle}>{message.summarization}</div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ) : null
        )}
      </div>
    </div>
  );
};

export default CodeTab;
