
import styled from "styled-components";

import * as S from "../../../shared/DraggableModal/ModalTemplate";
import { useState, useEffect, useRef, useContext } from "react";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "..";
import { AppContext } from "../utils/settingsReducer";
import ts from "../Translations/translations";




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
  padding: 5px 18px 18px;
  grid-template-rows: 18px 40px 18px 1fr; 
  justify-items: flex-start; 
  align-items: center;
  height: 100%;
  overflow: hidden;
`
const StyledLabel = styled.label<{ $animate: boolean }>`
  position: relative;
  top: 22px;
  left: 2px;
  padding: 3px 5px;
  background-color: white; 
  border-radius: 1px;
  font-weight: 600;
  font-size: 0.9em;
  color: #7A7A7A;
  transition: font-size 0.2s, transform 0.2s;
  transform: ${(props) => (props.$animate ? `translate(1px, -16px) scale(0.75)` : 'none')};
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
  updateQrCodeHandler: (newQrCode: QrCode) => void;
  currentModus: QrAppModi;
  qrCodeToEdit?: QrCode;
}

type InitialStateType = {
  qrCodeToEdit: QrCode;
  activeFields: { name: boolean, data: boolean };
}


const initialState: InitialStateType = { 
  qrCodeToEdit: { 
    name: '', 
    data: '', 
  }, 
  activeFields: {
    name: false,
    data: false,
  }
}

const QrForm = ({ saveNewQrCodeHandler, updateQrCodeHandler, currentModus, qrCodeToEdit }: Props) => {
  
  const [showQrForm, setShowQrForm] = useState(false);
  const [qrCode, setQrcode] = useState<InitialStateType['qrCodeToEdit']>(initialState.qrCodeToEdit);
  const [isActive, setIsActive] = useState<InitialStateType['activeFields']>(initialState.activeFields);
  const { state } = useContext(AppContext);

  // show component
  useEffect(()=>  {
    if (
    currentModus === QrAppModi.NEW_QR || 
    currentModus === QrAppModi.EDIT_QR
     ) {
      setShowQrForm(true);
  } else {
    setShowQrForm(false);
  }

  }, [currentModus])

  // when in NEW_QR mode empty fields and set fieds to inactive so that label is scaled up.
  // when in edit mode fill fields with QR data and set fields to active so that label doesn't cover the text
  useEffect(()=>  {
    if (currentModus === QrAppModi.NEW_QR) {
      setQrcode(initialState.qrCodeToEdit);
      setIsActive(initialState.activeFields);
    }
    if (qrCodeToEdit && currentModus === QrAppModi.EDIT_QR){
      setQrcode(qrCodeToEdit);
      setIsActive({
        name: true,
        data: true,
      })
    }
  }, [currentModus, qrCodeToEdit])
  
  const onFocusHandler = (field: keyof typeof isActive) => setIsActive((prev) => ({ ...prev, [field]: true }));
  const onBlurHandler = (field: keyof typeof isActive) => !qrCode.name && !qrCode.data ? setIsActive((prev) => ({ ...prev, [field]: false })) : null;

  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setQrcode({ ...qrCode, name: event.target.value });
  const handleDataInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => setQrcode({ ...qrCode, data: event.target.value });

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    currentModus === QrAppModi.EDIT_QR ? updateQrCodeHandler(qrCode) : saveNewQrCodeHandler(qrCode);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (

    showQrForm &&
    <QrFormWrapper onSubmit={onFormSubmit}>
      <InputWrapper >
        <StyledLabel $animate={isActive.name} htmlFor={'name'}>{ ts('name', state.language) }<span>*</span></StyledLabel>
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
        <button type="submit" style={{ marginLeft: "auto" }} disabled={!qrCode.name || !qrCode.data}>{currentModus === QrAppModi.EDIT_QR ? 'Update' : 'Save'}</button>
      </S.GenericFooter>
    </QrFormWrapper>
  );
};

export default QrForm;