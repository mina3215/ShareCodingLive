import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';

import left_code_data from './LeftCodeData';
import styled from 'styled-components';

const ClassAccordionContainer = styled.div`
  max-width: 1000px;
  margin-top: 5vh;
  width: 100%;
  padding : 3vw;
`;

const AccordionTitleStyles = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  cursor: pointer;
  background: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: larger;
`;


const CourseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const CourseTitleIcon = styled.div`
  display: flex;
  margin-left: 10px;
`;

const CourseStyle = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.isDActiveSection? '#C2CFE0':'white'};
  align-items: center;
  cursor: pointer;
  padding: 10px;
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
  /* background-color: #124686;
   */
  /* background : ${props => props.isActive? 'linear-gradient(0deg, #3C6EBF, #3F3998 )' : '#40409D'}; */
  background: linear-gradient(0deg, #3C6EBF, #3F3998 ); 
  padding: 20px;
  width: 56.8px;
`;

const PageNumberContainer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 17vh;
  left: 39vw;
  right: 0;
  padding: 20px;
`;

const CourseSection = ({ course, isDActiveSection, setDActiveIndex, sectionIndex }) => {
  console.log(course);
  return (
    <div>
      <CourseStyle isDActiveSection={isDActiveSection}  onClick={()=>{setDActiveIndex(isDActiveSection? null: sectionIndex)}}>
        <div>{course.title}</div>
        <div style={{fontSize: '11px', marginTop:'5px'}}>{course.teacher}</div>
      </CourseStyle>
    </div>
  );
};

const CorseContainerIndividual = styled.div`
  border: 2px solid ${props => (props.isactive ? '#40409C' : '#2a2d52')};
  border-radius:5px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const DateAccordian = ({ date, isActiveSection, setActiveIndex, sectionIndex }) => {
  const [dActiveIndex, setDActiveIndex] = useState('');

  return (
    <CorseContainerIndividual isactive={isActiveSection}>
      <AccordionTitleStyles
        style={{
          borderBottomLeftRadius: isActiveSection ? '0' : '5px',
          borderBottomRightRadius: isActiveSection ? '0' : '5px',
        }}
        onClick={() => {setActiveIndex(isActiveSection? null:sectionIndex)}}
      >
        <CourseTitleContainer>
          <div> </div>
          <div>{date.dateOfCourse}</div>
          <CourseTitleIcon>
            <Arrows isActiveSection={isActiveSection}>
              <FontAwesomeIcon icon={isActiveSection ? faAngleDown : faAngleRight} />
            </Arrows>
          </CourseTitleIcon>
        </CourseTitleContainer>
      </AccordionTitleStyles>
      {isActiveSection &&
        date.courses.map((course, index) => (
          <CourseSection
            course={course}
            key={index}
            isDActiveSection={index === dActiveIndex}
            setDActiveIndex={setDActiveIndex}
            sectionIndex={index}
          />
        ))}
    </CorseContainerIndividual>
  );
};

const courses = left_code_data;
const LeftConferenceHistory = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 2;
  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = courses.slice(indexOfFirstCode, indexOfLastCode);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <ClassAccordionContainer>
      {currentCodes.map((date, index) => (
        <DateAccordian
          date={date}
          key={index}
          isActiveSection={index === activeIndex}
          // setActiveIndex={setActiveIndex}
          setActiveIndex={(i)=>{setActiveIndex(i)}}
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

export default LeftConferenceHistory;
