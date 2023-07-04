import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { FunctionComponent, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import ReactDOM from "react-dom";
import * as S from "./style";

export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element;
  headerText: string;
}


type Position = {
  xRate: number;
  yRate: number;
};


export const DraggableModal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  headerText
}) => {

  const [currentPosition, setCurrentPosition] = useState<Position>({
    xRate: 50,
    yRate: 50
  });

  const onDrag = (_e: DraggableEvent, data: DraggableData) => {
    setCurrentPosition({ xRate: data.lastX, yRate: data.lastY });
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
           <Draggable
    position={{
      x: currentPosition.xRate,
      y: currentPosition.yRate
    }}
    onDrag={onDrag}
  >
          <S.StyledModal>
            <S.Header>
              <S.HeaderText>{headerText}</S.HeaderText>
              <S.CloseButton onClick={hide}>×</S.CloseButton>
            </S.Header>
            <S.Content>{modalContent}</S.Content>
          </S.StyledModal>
          </Draggable>
        </S.Wrapper>
      </FocusLock>
      </>

  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;
