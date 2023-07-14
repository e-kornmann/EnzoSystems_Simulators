import styled from "styled-components";
import * as Sv from "../../../shared/stylevariables";


// type Props = {
//     $aligntop : boolean;
// }

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
    font-size: 0.85em;
    text-align: center; 
    line-height: 1.2em;
    padding: 15px 40px;
    
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 1.5em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;

export const WelcomeLine = styled(Mainline)`
    font-size: 1.2em;
`;

export const IconContainer = styled.div`
    width: 100px;
    margin-bottom: 15px;
`;

