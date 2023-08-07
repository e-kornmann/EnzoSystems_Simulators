import styled from "styled-components";


const NewQrWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 26px; 
  justify-content: center;
  align-items: center;
  line-height: 0.9em;
  margin: auto;
  width: 80%;
  height: 90%;
`

const Footer = styled.footer`
  font-size: 12px;
  color: pink;
  width: 100%;
  height: 100%;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  
  background-color: white;
  border-radius: 0 0 5px 5px;
`




const NewQr = () => {
    





  return (



      <NewQrWrapper>    
        <div>New QR</div>
    
    
        <Footer>
            <div>Save</div>
            <div>qr</div>
        </Footer>
      </NewQrWrapper>

  );
};

export default NewQr;







