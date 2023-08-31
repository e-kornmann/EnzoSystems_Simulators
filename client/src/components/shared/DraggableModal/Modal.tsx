import { FunctionComponent, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';
import Draggable from "react-draggable";
import { SharedCross } from "../CheckAndCrossIcon";




export const Wrapper = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	aligng-items: flex-start;
	top: 50%;
	left: 50%;
	pointer-events: none;
	transform: translate(-50%, -50%);
	z-index: 30;
`


type Props = { 
	$grabbing: boolean;
}

export const StyledModal = styled.div<Props>`
	z-index: 70;
	cursor:  ${(props) => (props.$grabbing ? "grabbing" : "grab")};
	pointer-events: auto;
`

// for now don't display it
export const CloseButton = styled.button`
	position: absolute;
  display: none;
  justify-content: center;
  align-items: center;
	right: 0;
	top: -28px;
	font-family: 'Rubik', sans-serif;
	width: 15px;
	height: 16px;
	border-radius: 1px;
  background: ${Sv.gray};
	&:hover {
		cursor: pointer;
		color: ${Sv.enzoOrange};
    background-color: ${Sv.asphalt};
    & > svg {
      fill: white;
    }
  
	}
`
type ContentProps = { 
	$width: string;
	$height: string;
}
export const Content = styled.div<ContentProps>`
	width: ${(props) => props.$width};
	height: ${(props) => props.$height};
  border-radius: 5px;	
	overflow-x: hidden;
	overflow-y: hidden;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`
export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element;
  modalWidth: string,
  modalHeight: string,
}
export const DraggableModal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  modalWidth,
  modalHeight
}) => {

  
  const [isGrabbing, setIsGrabbing] = useState(false);
  
  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

 

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "x" && isShown) {
        hide();
      }
    };
    if (isShown) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeyDown, false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [isShown, hide]);

  const modal = (
    <>
      <Wrapper
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Draggable>
          <StyledModal $grabbing={isGrabbing}>
              <CloseButton onClick={hide}>
                <SharedCross width={8} height={8} />
              </CloseButton>
            <Content $width={modalWidth} $height={modalHeight}>{modalContent}</Content>
          </StyledModal>
        </Draggable>
        
      </Wrapper>
    </>
  );
  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;
