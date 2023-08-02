import styled from "styled-components";

export const LoadingDots = styled.div`
    font-weight: bold;
    display: inline-block;
    color: gray;
    font-family: monospace;
    font-size: 30px;
    clip-path: inset(0 3ch 0 0);
    animation: l 1s steps(4) infinite;
    height: 30px;
  }

  @keyframes l {
    to {
      clip-path: inset(0 -1ch 0 0);
    }
  }
`;

export const Loading = () => <LoadingDots>...</LoadingDots>;