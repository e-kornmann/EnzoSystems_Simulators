import { FunctionComponent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Draggable from 'react-draggable';

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

type Props = {
  $grabbing: boolean;
};

export const StyledModal = styled.div<Props>`
  z-index: 70;
  cursor:  ${props => (props.$grabbing ? 'grabbing' : 'grab')};
  pointer-events: auto;
`;

type ContentProps = {
  $width: number;
  $height: number;
};
export const Content = styled('div')<ContentProps>(({ $width, $height }) => ({
  width: $width,
  height: $height,
  borderRadius: '5px',
  overflowX: 'hidden',
  overflowY: 'hidden',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
}));

export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element | null;
  modalWidth: number,
  modalHeight: number,
}
export const DraggableModal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  modalWidth,
  modalHeight,
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
      if (event.ctrlKey && event.key === 'x' && isShown) {
        hide();
      }
    };
    if (isShown) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeyDown, false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
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
            <Content $width={modalWidth} $height={modalHeight}>{modalContent}</Content>
          </StyledModal>
        </Draggable>

      </Wrapper>
    </>
  );
  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};

export default DraggableModal;
