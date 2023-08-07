import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
// import { Button } from '@mui/material';

// 복사 이모티콘
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
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
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CodeTab = (props) => {

  const [expanded, setExpanded] = React.useState('');

  // 이거는 눌렀을때 아코디언 열리게 하기 위한 함수 중 하나
  const handleChange = (panel) => (event, newExpanded) => {
    console.log(newExpanded)
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
      {console.log("코드탭")}
      <div>코드탭 컨텐츠</div>
      <div>
        {props.messages.map((message, index) => (
            message.type === 'CODE' ? 
            <Accordion key={index} expanded={expanded === `message_${index}`} onChange={handleChange(`message_${index}`)}>
              {/* 제목 표시 */}
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography >
                  <span>{message.title}</span>
                  <span>{message.sender}</span>
                  <span>{message.time}</span>
                  </Typography>
              </AccordionSummary>
              {/* 코드 본문 표시(아코디언 펼쳐지면보여질 내용) */}
              <AccordionDetails >
                {/* FIXME: 질문 코드 창 예쁘게, 사이즈 줄이면 따라서 움직이게 */}
                {/* FIXME: textarea 코드 모아보기에서는 수정 안되게 */}
                {/* FIXME: 코드 복사 버튼 만들기 */}
                {/* FIXME: 코드 복사 기능 */}
                <div>
                  {/* <SyntaxHighlighter language="javascript" style={docco}>
                    <textarea name="" id="" cols="30" rows="10">{message.message}</textarea>
                  </SyntaxHighlighter> */}
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',  // 컨테이너 크기를 내용에 맞게 조절
                  }}>

                    {/* 복사 버튼 */}
                    <ContentCopyIcon size="small" variant="outlined" onClick={() => handleCopy(message.message)} style={{
                      position: 'absolute', top: 0, right: 0, padding: '2px',
                      minWidth: '5px', // 원하는 크기로 조절
                      minHeight: '5px'}} />

                    {/* textarea는 defaultValue 안에 값 줘야지 console에 에러가 안뜸 */}
                    <textarea readOnly name="" id="" cols="30" rows="10" defaultValue={message.message} style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      resize: 'none',
                    }}>
                    </textarea>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            : null))}
      </div>
    </div>
    
  )
  
}

export default CodeTab;
