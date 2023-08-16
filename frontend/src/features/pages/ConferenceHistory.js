import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

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
  width: 100%;
  background: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: larger;
`;

const CourseTitleContainer = styled.div`
  display: block flex;
  width : 100%;
  border-bottom: 0px;
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
  background-color: #4454AB;
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

const CorseContainerIndividual = styled.div`
  /* border: 2px solid #2a2d52; */
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  padding: 1vw;
  font-weight: bold;  
`;


const CodeAccordion = ({ code, isActiveSection, setActiveIndex, sectionIndex }) => {
  const [dActiveIndex, setDActiveIndex] = useState();
  const toggleSection = () => {
    const nextIndex = isActiveSection ? null : sectionIndex;
    setActiveIndex(nextIndex);
  };

  return (
    <div>
    <CorseContainerIndividual>
      <AccordionTitleStyles onClick={toggleSection}>
        <div>{code.title}</div>
        <FontAwesomeIcon icon={isActiveSection? faAngleDown: faAngleRight} />
      </AccordionTitleStyles>
    </CorseContainerIndividual>
    {isActiveSection &&(
        <div>
        <CodeContainer>
          <SyntaxHighlighter
            style={vscDarkPlus}
            customStyle={{ background: '#2a2d52', borderRadius: '5px', margin: '10px', padding: '15px' }}
          >
            {code.content}
          </SyntaxHighlighter>
        </CodeContainer>
        <SummaryContainer>
          <div
            style={{ background: '#2a2d52', borderRadius: '5px', margin: '10px', padding: '15px', color: 'white' }}
          >
            {code.summarization}
          </div>
        </SummaryContainer>
      </div>)}
    </div>
  );
};

const FullWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  border: 2px solid #4454AB;


`

const ConferenceHistory = () => {
  console.log(useSelector((state)=>state.pages))
  const course = useSelector((state) => state.pages.course);
  const codes = course? course.codes:null;
  const title = course?course.title:null;
  const [activeIndex, setActiveIndex] = useState();
  // const [currentPage, setCurrentPage] = useState(1);
  // const codesPerPage = 2;

  // const indexOfLastCode = currentPage * codesPerPage;
  // const indexOfFirstCode = indexOfLastCode - codesPerPage;
  // // const currentCodes = courses.slice(indexOfFirstCode, indexOfLastCode);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  return (
    <FullWrapper>
    <AccordionTitleStyles>
      <CourseTitleContainer>
        <CourseTitleIcon>
          <Arrows>
            <FontAwesomeIcon icon={faAngleDown} />
          </Arrows>
        </CourseTitleIcon>

        <div style={{marginRight: '2vw'}}>{title}</div>
      </CourseTitleContainer>
    </AccordionTitleStyles>
    {codes && codes.map((code, index) => (
      <CodeAccordion
        code={code}
        key={index}
        isActiveSection={index === activeIndex}
        setActiveIndex={setActiveIndex}
        sectionIndex={index}
    />
    ))}
      {/* <PageNumberContainer>
        <Pagination>
          {Array.from({ length: Math.ceil(courses.length / codesPerPage) }).map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </PageNumberContainer>  */}
    </FullWrapper>
  );
};

export default ConferenceHistory;
