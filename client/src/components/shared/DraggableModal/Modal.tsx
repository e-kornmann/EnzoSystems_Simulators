import { FunctionComponent, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
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


  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });
  
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

    <S.Backdrop onClick={hide} />
      <FocusLock>
      
        <S.Wrapper
          aria-modal
          aria-labelledby={headerText}
          tabIndex={-1}
          role="dialog"
        >
      
          
          <DragMove onDragMove={handleDragMove}>
     
            <S.StyledModal  style={{
              transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }}>
            <S.Header>
              <S.HeaderText>{headerText}</S.HeaderText>
              <S.CloseButton onClick={hide}>×</S.CloseButton>
            </S.Header>
            
            <S.Content>{modalContent}</S.Content>
                      </S.StyledModal>
                      </DragMove>

        </S.Wrapper>
        
      </FocusLock>
  
      </>

  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;



