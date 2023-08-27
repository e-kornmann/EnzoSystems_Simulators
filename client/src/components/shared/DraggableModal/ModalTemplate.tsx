import styled from "styled-components";
import * as Sv from "../../../styles/stylevariables";

export const Container = styled.main`
  display: grid;
  grid-template-rows: auto 1fr;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  width: 100%;
  height: 100%;
  min-height: 420px;
  background-color: ${Sv.appBackground};
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
  padding: 6px 13px 10px;
  background-color: white;
  border-radius: 0 0 5px 5px;
  & > button {
    display: flex;
    align-items: top;
    padding: 2px;
    justify-content: center;
    color: ${Sv.enzoOrange};
    font-size: 0.80em;
    cursor: pointer;
    &:disabled  
    {
      color: ${Sv.gray};
    }
  }
  & > svg {
    margin: 2px;
  }
  
  & > div {
    cursor: pointer;
    width: 100%;
    height: 100%;
  
    display: flex;
    justify-content: center;
    column-gap: 8px;
    align-items: center;
    color: ${Sv.asphalt};
    &:first-of-type {
      justify-content: flex-start;
    }
    &:last-of-type {
      justify-content: flex-end;
    }
    & > svg {
      fill: ${Sv.asphalt};
    }
  }
`;


export const GenericList = styled.div`
  padding: 2px 0;
  display: flex;
  flex-direction: column;
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
  text-align: left;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.13em solid ${Sv.lightgray};
  width: 100%;
  height: 40px;
  font-size: 0.9em;
  padding: 11px;
  column-gap: 20px;
  & > svg {
    min-width: 14px;
  }
  & > span {
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis; 
    max-width: 82%;
  }
  &:active {
  &:active {
    background-color: ${Sv.enzoLightOrange};
    fill: ${Sv.enzoOrange};
  }
`;