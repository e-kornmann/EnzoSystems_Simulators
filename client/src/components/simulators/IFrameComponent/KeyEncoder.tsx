import styled from "styled-components";
import { ReactComponent as DragIcon } from '../../../assets/svgs/drag-icon.svg';
import * as Sv from "../../../styles/stylevariables";

const IframeContainer = styled.div`
  height: 100%; 
  overflow: hidden; 
`
const DragIconWrapper = styled.div`
 display: grid;
 justify-content: center; 
 align-content: flex-start;
 padding: 8px;
 width: 100%;
 height: 50px;
 background-color: lightgray;
 border-radius: 5px 5px;
 position: absolute;
 top: -40px;
 z-index: -1;
`
  const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  padding: 0;
  margin: 0;
  border-radius: 5px;
`

const KeyEncoderIframe = () => {
  return (
    
  <IframeContainer>
    <DragIconWrapper>
      <DragIcon width={14} height={14} />
      </DragIconWrapper>
    <StyledIframe src="http://localhost:6968/" />
  </IframeContainer>

  )
}

export default KeyEncoderIframe