import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import code_data from './CodeData';
import styled from 'styled-components';
import { getToken } from '../../common/api/JWT-common';
import { getCodeData } from './pagesSlice';

const ClassAccordionContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  // height: 100%;
  margin-top: 5vh;
`;

const AccordionTitleStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  // padding: 20px;
  background: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: larger;
`;

const CourseTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CourseTitleIcon = styled.div`
  margin-right: 10px;
`;

const CodeStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  margin-top: 3px;
`;

const CodeContainer = styled.div`
  overflow: auto;
  max-height: 12vh;
  max-width: 22.6vw;
  background: #2a2d52;
  border-radius: 5px;
  margin: 10px;
`;

const SummaryContainer = styled.div`
  overflow: auto;
  max-height: 7vh;
  max-width: 22.6vw;
  background: #2a2d52;
  border-radius: 5px;
  margin: 10px;
`;

const Arrows = styled.div`
  background-color: #124686;
  padding: 20px;
`;

// const PageNumberContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

const PageNumberContainer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 17vh;
  left: 39vw;
  right: 0;
  // background-color: white;
  padding: 20px;
`;

// const CorseContainer = styled.div`
//   border: 2px solid #2a2d52;
//   border-radius: 5px;
//   margin-bottom: 10px;
// `;

const CodeSection = ({ codeInfo, isDActiveSection, setDActiveIndex, sectionIndex }) => {
  const toggleSection = () => {
    const nextIndex = isDActiveSection ? null : sectionIndex;
    setDActiveIndex(nextIndex);
  };

  return (
    <div>
      <CodeStyles onClick={toggleSection}>
        <div>{codeInfo.codeTitle}</div>
        <div>
          <FontAwesomeIcon icon={isDActiveSection ? faAngleDown : faAngleRight} />
        </div>
      </CodeStyles>
      {isDActiveSection && (
        <div>
          <CodeContainer>
            <SyntaxHighlighter
              language={codeInfo.language}
              style={vscDarkPlus}
              customStyle={{ background: '#2a2d52', borderRadius: '5px', margin: '10px', padding: '15px' }}
            >
              {codeInfo.code}
            </SyntaxHighlighter>
          </CodeContainer>
          <SummaryContainer>
            <div
              style={{ background: '#2a2d52', borderRadius: '5px', margin: '10px', padding: '15px', color: 'white' }}
            >
              {codeInfo.summarization}
            </div>
          </SummaryContainer>
        </div>
      )}
    </div>
  );
};

const CorseContainerIndividual = styled.div`
  border: 2px solid #2a2d52;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const CodeAccordion = ({ course, isActiveSection, setActiveIndex, sectionIndex }) => {
  const [dActiveIndex, setDActiveIndex] = useState();
  const toggleSection = () => {
    const nextIndex = isActiveSection ? null : sectionIndex;
    setActiveIndex(nextIndex);
  };

  return (
    <CorseContainerIndividual>
      <AccordionTitleStyles
        style={{
          borderBottomLeftRadius: isActiveSection ? '0' : '5px',
          borderBottomRightRadius: isActiveSection ? '0' : '5px',
        }}
        onClick={toggleSection}
      >
        <CourseTitleContainer>
          <CourseTitleIcon>
            <Arrows>
              <FontAwesomeIcon icon={isActiveSection ? faAngleDown : faAngleRight} />
            </Arrows>
          </CourseTitleIcon>
          <div>{course.title}</div>
        </CourseTitleContainer>
        <div></div>
      </AccordionTitleStyles>
      {isActiveSection &&
        course.codes.map((codeInfo, index) => (
          <CodeSection
            codeInfo={codeInfo}
            key={index}
            isDActiveSection={index === dActiveIndex}
            setDActiveIndex={setDActiveIndex}
            sectionIndex={index}
          />
        ))}
    </CorseContainerIndividual>
  );
};

const ConferenceHistory = () => {
  const [courses, setCourses] = useState(code_data);
  const [activeIndex, setActiveIndex] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 2;
  // const token = getToken();
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTE3Mjk4OTAsImlhdCI6MTY5MTcyOTg5MCwiZW1haWwiOiJtaW5zdUBzc2FmeS5jb20iLCJuaWNrbmFtZSI6Im1pbnN1In0.L2VOSwEk6coqU9hGk7x1VeqMLW2FYD8uedjsYROdZ2k';
  const dispatch = useDispatch();
  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = courses.slice(indexOfFirstCode, indexOfLastCode);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const data = {
      token,
    };
    dispatch(getCodeData(data))
      .unwrap()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        // if (err.status === 400) {
        //   toast.error('비밀번호를 다시 입력해주세요');
        // } else if (err.status === 401) {
        //   toast.error('다시 로그인해주세요');
        //   props.hangeLogout(true);
        //   props.ToUserInfo(false);
        // } else if (err.status === 404) {
        //   toast.error('다시 로그인해주세요');
        //   props.hangeLogout(true);
        //   props.ToUserInfo(false);
        // } else if (err.status === 500) {
        //   navigate('/error');
        // }
      });
  }, []);

  return (
    <ClassAccordionContainer>
      {currentCodes.map((course, index) => (
        <CodeAccordion
          course={course}
          key={index}
          isActiveSection={index === activeIndex}
          setActiveIndex={setActiveIndex}
          sectionIndex={index}
        />
      ))}
      <PageNumberContainer>
        <Pagination>
          {Array.from({ length: Math.ceil(courses.length / codesPerPage) }).map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </PageNumberContainer>
    </ClassAccordionContainer>
  );
};

export default ConferenceHistory;
