import styled from 'styled-components';

const StyledTitlebar = styled.div`
  color: white;
  background-color: black;
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTitlebarButtonLeft = styled.div`
  color: white;
  background-color: white;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  left: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTitlebarButtonRight = styled.div`
  color: white;
  background-color: white;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Titlebar (props: any) {
  return <StyledTitlebar onClick={props.onClickMiddle}> <StyledTitlebarButtonLeft onClick={props.onClickLeft} /><StyledTitlebarButtonRight onClick={props.onClickRight} />Payment Terminal</StyledTitlebar>;
}

export default Titlebar;