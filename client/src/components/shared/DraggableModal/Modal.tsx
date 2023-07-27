import { FunctionComponent, useEffect, useState } from "react";

import ReactDOM from "react-dom";
import * as S from "./style";
// import { Draggable } from "./Draggable";
// import Drag from "./Drag";
import DragMove from "./Drag";


export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element;
  headerText: string;
  identifier: string;
}


export const DraggableModal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  headerText,
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
      if (event.keyCode === 27 && isShown) {
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
     
        <S.Wrapper
          aria-modal
          aria-labelledby={headerText}
          tabIndex={-1}
          role="dialog"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}   
        >
      
          
          <DragMove onDragMove={handleDragMove}>
     
            <S.StyledModal $grabbing={isGrabbing} style={{
              transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }}>
            <S.Header>
              <S.CloseButton onClick={hide}>×</S.CloseButton>
            </S.Header>
            
            <S.Content>{modalContent}</S.Content>
                      </S.StyledModal>
                      </DragMove>

        </S.Wrapper>

  
      </>

  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;



