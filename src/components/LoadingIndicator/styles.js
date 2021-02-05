import styled from 'styled-components';

const LoadingContainerAbsolute = styled.div`
  display: flex;
  position: absolute;
  height: 100vh;
  width: 80vw;
  align-items: center;
  justify-content: center;
`;

const LoadingContainerLocal = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export { LoadingContainerAbsolute, LoadingContainerLocal };
