import { FunctionComponent, useEffect, useState } from "react";

import ReactDOM from "react-dom";
import * as S from "./style";
import DragMove from "./Drag";


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
          
              <S.CloseButton onClick={hide}>×</S.CloseButton>
          

            <S.Content $width={modalWidth} $height={modalHeight}>{modalContent}</S.Content>
          </S.StyledModal>
        </DragMove>
      </S.Wrapper>
    </>
  );
  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;
