import { FunctionComponent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DragMove from "./Drag";
import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';
import CrossIcon from "../Fail";

type Props = { 
	$grabbing: boolean;
}

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
`;

export const StyledModal = styled.div<Props>`
	z-index: 70;
	cursor:  ${(props) => (props.$grabbing ? "grabbing" : "grab")};
	pointer-events: auto;
`;

export const CloseButton = styled.button`
	position: absolute;
	right: 0;
	top: -40px;
	font-family: 'Rubik', sans-serif;
	width: 20px;
	height: 20px;
	border-radius: 3px;
	background: ${Sv.gray};
	&:hover {
		cursor: pointer;
		color: ${Sv.enzoOrange};
	}
`;

type ContentProps = { 
	$width: number;
	$height: number;
}

export const Content = styled.div<ContentProps>`
	width: ${(props) => props.$width}px;
	height: ${(props) => props.$height}px;
	border-radius: 5px;	
	overflow-x: hidden;
	overflow-y: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;



export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element;
  headerText: string;
  modalWidth: number,
  modalHeight: number,
}


export const DraggableModal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  headerText,
  modalWidth,
  modalHeight
}) => {

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  const handleDragMove = (e: { movementX: number; movementY: number; }) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isShown) {
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
        aria-modal
        aria-labelledby={headerText}
        tabIndex={-1}
        role="dialog"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <DragMove onDragMove={handleDragMove}>
          <StyledModal $grabbing={isGrabbing} style={{
            transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
          }}>
          
              <CloseButton onClick={hide}><CrossIcon width={10} height={10} fill={'white'} /></CloseButton>
          

            <Content $width={modalWidth} $height={modalHeight}>{modalContent}</Content>
          </StyledModal>
        </DragMove>
      </Wrapper>
    </>
  );
  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;