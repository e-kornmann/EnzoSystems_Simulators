import styled from "styled-components";
import * as Sv from "../../../shared/stylevariables";


export const Container = styled.div`
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    line-height: 1.7em;
    z-index: 1000;
  `;

export const Subline = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.7em;
    font-weight: 500;
    text-align: center; 
    line-height: 0.55em;
    padding: 15px 40px;
`;

export const SublineBottom = styled(Subline)`
    font-size: 0.9em;
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.2em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;

export const WelcomeLine = styled(Mainline)`
    font-weight: 500;
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    margin-bottom: 15px;
`;

