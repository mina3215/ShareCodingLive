import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCourse, getCodeData } from './pagesSlice/pagesSlice';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import { getToken } from '../../common/api/JWT-common';

import styled from 'styled-components';

const ClassAccordionContainer = styled.div`
  max-width: 1000px;
  // margin-top: 5vh;
  width: 100%;
  padding: 3vw;
`;

const AccordionTitleStyles = styled.div`
  display: flex;
  justify-content: center;
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
  /* background : ${(props) => (props.isActive ? 'linear-gradient(0deg, #3C6EBF, #3F3998 )' : '#40409D')}; */
  background: linear-gradient(0deg, #3c6ebf, #3f3998);
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
  const dispatch = useDispatch();
  const toggleSection = (course) => {
    setDActiveIndex(isDActiveSection ? null : sectionIndex);
    dispatch(setCourse(course));
  };
  return (
    <div>
      <CourseStyle
        style={{ backgroundColor: `${isDActiveSection ? '#C2CFE0' : 'white'}` }}
        onClick={() => {
          toggleSection(course);
        }}
      >
        <div>{course.title}</div>
        <div style={{ fontSize: '11px', marginTop: '5px' }}>{course.teacher}</div>
      </CourseStyle>
    </div>
  );
};

const CorseContainerIndividual = styled.div`
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const DateAccordian = ({ date, isActiveSection, setActiveIndex, sectionIndex }) => {
  const [dActiveIndex, setDActiveIndex] = useState(0);
  const toggleSection = (date) => {
    const nextIndex = isActiveSection ? null : sectionIndex;
    setActiveIndex(nextIndex);
    setDActiveIndex();
  };
  return (
    <CorseContainerIndividual style={{ width: '100%', border: `2px solid ${isActiveSection ? '#40409C' : '#2a2d52'}` }}>
      <AccordionTitleStyles
        style={{
          borderBottomLeftRadius: isActiveSection ? '0' : '5px',
          borderBottomRightRadius: isActiveSection ? '0' : '5px',
        }}
        onClick={() => {
          toggleSection(date.dateOfCourse);
        }}
      >
        <CourseTitleContainer>
          <div> </div>
          <div>{date.dateOfCourse}</div>
          <CourseTitleIcon>
            <Arrows>
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

const LeftConference = () => {
  const token = getToken();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState('');
  useEffect(() => {
    getcode();
  }, []);

  const getcode = () => {
    const data = {
      token: token,
    };
    dispatch(getCodeData(data))
      .unwrap()
      .then((res) => {
        setCourses(res);
        console.log(res);
      })
      .catch();
  };

  const [leftactiveindex, setLeftActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const codesPerPage = 2;
  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = courses ? courses.slice(indexOfFirstCode, indexOfLastCode) : '';

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <ClassAccordionContainer>
      {courses &&
        currentCodes.map((date, index) => (
          <DateAccordian
            date={date}
            key={index}
            isActiveSection={index === leftactiveindex}
            setActiveIndex={setLeftActiveIndex}
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

export default LeftConference;
