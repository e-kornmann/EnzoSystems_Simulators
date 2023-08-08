import styled from "styled-components";
import * as Sv from "../../../styles/stylevariables";

export const Container = styled.main`
  background-color: ${Sv.appBackground};
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 420px;
  grid-template-rows: auto 1fr;
`;

export const Header = styled.div`
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.enzoOrange};
  font-weight: 500;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: white;

  & > svg {
    position: relative;
    fill: ${Sv.asphalt}; 
    cursor: pointer;
  }

  & > div {
    & > svg {
      position: relative;
      fill: ${Sv.asphalt}; 
      cursor: pointer;
    }
  }
`;


export const GenericFooter = styled.footer`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 15px;
  background-color: white;
  border-radius: 0 0 5px 5px;
  & > button {
    color: ${Sv.enzoOrange};
    font-size: 0.80em;
    cursor: pointer;
    margin-right: 4px;
    &:disabled  
    {
      color: ${Sv.gray};
    }
  }
  & > svg {
    margin: 2px;
  }
  & > div {
    margin-right: 5px;
    display: flex;
    justify-content: flex-end;
    column-gap: 5px;
    align-items: center;
    color: ${Sv.asphalt};
    & > svg {
      fill: ${Sv.asphalt};
    }
  }
`;


export const GenericList = styled.div`
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  align-items: 'flex start';
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background: transparent; 
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${Sv.gray}; 
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${Sv.asphalt}; 
  };
`;

export const GenericListButton = styled.button`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.13em solid ${Sv.lightgray};
  width: 100%;
  height: 40px;
  font-size: 0.9em;
  padding: 11px;
  &:active {
    background-color: ${Sv.enzoLightOrange};
    fill: ${Sv.enzoOrange};
  }
`;