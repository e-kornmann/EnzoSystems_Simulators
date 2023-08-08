import styled from "styled-components";
import * as Sv from "../../../styles/stylevariables";

export const Container = styled.main`
  background-color: white;
  font-family: 'Inter', sans-serif;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 35px 1fr;
`;

export const Header = styled.div`
  fill: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: ${Sv.enzoOrange};
  font-weight: 500;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  fill: black;
`;


export const GenericFooter = styled.footer`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 15px;
  background-color: white;
  border-radius: 0 0 5px 5px;
  & > button {
    color: ${Sv.enzoOrange};
    font-size: 0.75em;
    cursor: pointer;
    &:disabled  
    {
      color: ${Sv.gray};
    }
  }
`;