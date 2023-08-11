
import styled from "styled-components";

import * as S from "../../../shared/DraggableModal/ModalTemplate";
import { useState, useEffect, useRef } from "react";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "./QrCodeReader";




const QrFormWrapper = styled.form`
  position: absolute;
  top: 35px;
  height: calc(100% - 35px);
  border-radius: 0 0 5px 5px;
  background-color: ${Sv.appBackground};
  display: grid;
  grid-template-rows: 1fr auto; 
  z-index: 400;
`
const InputWrapper = styled.div`
  display: grid;
  padding: 5px 20px 20px;
  grid-template-rows: 18px 40px 18px 1fr; 
  justify-items: flex-start; 
  align-items: center;
  height: 100%;
  overflow: hidden;
`
const StyledLabel = styled.label<{ $animate: boolean }>`
  position: relative;
  top: 25px;
  left: 8px;
  padding: 3px 5px;
  background-color: white; 
  font-weight: 600;
  font-size: 0.9em;
  color: #7A7A7A;
  transition: font-size 0.2s, transform 0.2s;
  transform: ${(props) => (props.$animate ? `translate(-4px, -15px) scale(0.75)` : 'none')};
  & > span {
    color: orange;
  }
`
const StyledInput = styled.input`
  color: ${Sv.asphalt};
  font-size: 1.0em;
  font-weight: 500;
  border: 0.12em solid ${Sv.lightgray};
  border-radius: 3px;
  padding: 8px;
  width: 100%;
  height: 100%;
  &:focus {
    border-color: ${Sv.enzoOrange};
    outline: none;
  }
`
const StyledTextArea = styled.textarea`
  color: ${Sv.asphalt};
  font-size: 1.0em;
  font-weight: 500;
  border: 0.12em solid ${Sv.lightgray};
  border-radius: 3px;
  padding: 10px 8px;
  resize: none;
  width: 100%;
  height: 100%;
  &:focus {
    border-color: ${Sv.enzoOrange};
    outline: none;
  }
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
`

type Props = {
  saveNewQrCodeHandler: (newQrCode: QrCode) => void;
  isEditMode: boolean;
  qrCodeToEdit?: QrCode;
}

type InitialStateType = {
  qrCodeToEdit: QrCode;
  activeFields: { name: boolean, data: boolean };
}

const QrForm = ({ saveNewQrCodeHandler, isEditMode, qrCodeToEdit }: Props) => {
  

  
  
  const initialState: InitialStateType = isEditMode && qrCodeToEdit ? {
    qrCodeToEdit, activeFields: {
      name: true,
      data: true
    }
  } :
    {
      qrCodeToEdit: { name: '', data: '' }, activeFields: {
        name: false,
        data: false
      }
    }

  const [qrCode, setQrcode] = useState<InitialStateType['qrCodeToEdit']>(initialState.qrCodeToEdit);
  const [isActive, setIsActive] = useState<InitialStateType['activeFields']>(initialState.activeFields);

  const onFocusHandler = (field: keyof typeof isActive) => setIsActive((prev) => ({ ...prev, [field]: true }));
  const onBlurHandler = (field: keyof typeof isActive) =>   !qrCode.name && !qrCode.data ? setIsActive((prev) => ({ ...prev, [field]: false })) : null;

  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setQrcode({ ...qrCode, name: event.target.value });
  const handleDataInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => setQrcode({ ...qrCode, data: event.target.value });

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveNewQrCodeHandler(qrCode);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <QrFormWrapper onSubmit={onFormSubmit}>
      <InputWrapper >
        <StyledLabel $animate={isActive.name} htmlFor={'name'}>Name<span>*</span></StyledLabel>
        <StyledInput
          ref={inputRef}
          id='name'
          type='text'
          value={qrCode.name}
          onChange={handleNameInput}
          autoComplete="off"
          onFocus={() => onFocusHandler('name')}
          onBlur={() => onBlurHandler('name')}
        />
        <StyledLabel $animate={isActive.data} htmlFor={'data'}>Data<span>*</span></StyledLabel>
        <StyledTextArea
          id="data"
          name="data"
          value={qrCode.data}
          onChange={handleDataInput}
          onFocus={() => onFocusHandler('data')}
          onBlur={() => onBlurHandler('data')}
        > <span>Data:</span>
        </StyledTextArea>
      </InputWrapper>
      <S.GenericFooter>
        <button type="submit" style={{ marginLeft: "auto" }} disabled={!qrCode.name || !qrCode.data}>{isEditMode ? 'Update' : 'Save'}</button>
      </S.GenericFooter>
    </QrFormWrapper>
  );
};

export default QrForm;







