import { useEffect, useState } from 'react'
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-size: 0.7em;
  font-weight: 500;
  padding: 15px 15px 5px;
  background-color: transparent;
`;

const TimeRibbon = () => {
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date().toLocaleTimeString());
          setCurrentDate(new Date().toLocaleDateString());
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
    }, []);
    
  return (
    <Container>
        <div>{currentDate}</div>
        <div>{currentTime}</div>
    </Container>
  )
}

export default TimeRibbon