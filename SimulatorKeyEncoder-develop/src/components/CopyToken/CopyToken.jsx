import styled from 'styled-components'

const StyledButton = styled('div')({
    position: 'fixed',
    top: '150px',
    right: '-30px',
    padding: '10px',
    fontSize: '0.4em',
    cursor: 'copy',
    rotate: '90deg',
    color: 'transparent',

})

const CopyToken = (token) => {

  return (
      <StyledButton onClick={() => {
        navigator.clipboard.writeText(token.token);}}>
       COPY ACCESS TOKEN
      </StyledButton>
  )
}

export default CopyToken