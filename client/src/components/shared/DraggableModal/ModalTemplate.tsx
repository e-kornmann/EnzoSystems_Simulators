import styled from "styled-components";
import { enzoOrange } from "../../../styles/stylevariables";

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
  color: ${enzoOrange};
  font-weight: 500;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  fill: black;
`;

export const Content = styled.div`
  padding: 0 10px 55px;
  display: flex;
  flex-direction: column;
  font-size: 17px;
  background-color: #EBEBEB;
  overflow-y: sunset;
`;
