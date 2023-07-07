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
`;

export const Subline = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.85em;
    text-align: center; 
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 1.5em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;


export const IconContainer = styled.div`
    width: 100px;
    margin-bottom: 15px;
`;

