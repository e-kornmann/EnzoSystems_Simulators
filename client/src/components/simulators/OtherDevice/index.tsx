import styled from 'styled-components';
import * as Sv from '../../shared/stylevariables';

const Container = styled.main`
background-color: white;
font-family: 'Inter', sans-serif;
display: grid;
width: 560px;
height: 360px;
column-gap: 15px;
grid-template-rows: 60px 300px;
border-radius: 10px;
`;


const Header = styled.div`
grid-row: 1 / 2;
display: flex;
justify-content: center;
align-items: center;
font-size: 20px;
color: ${Sv.enzoOrange};
font-weight: 500;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
`;

const TextBox = styled.div`
grid-row: 2 / 3;
padding: 12px 15px;
display: flex;
justify-content: center;
align-items: center;
font-size: 25px;
background-color: #F7F7F7;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
`;
const OtherDevice = () => {

  return (
    <Container>
        <Header>Other Device</Header>
        <TextBox>This is a other device</TextBox>
    </Container>
  );
};

export default OtherDevice;







