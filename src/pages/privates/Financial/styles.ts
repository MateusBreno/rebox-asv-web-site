// ./src/pages/privates/Financial/styles.ts
import styled from 'styled-components';

export const Container = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
`;

export const ContainerGroup = styled.div`
  flex: 1;
  display: flex;
`;

export const Content = styled.section`
  width: 100%;
  height: calc(100vh - 65px);
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  padding: 3vh 4vw;
  overflow-y: scroll;
`;

export const Estimates = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2vw;
  padding: 4vh 0;

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
    row-gap: 2vw;
  }

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
  }
`;

export const ButtonsOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  .btn-update {
    max-width: 140px;
  }

  @media (max-width: 320px) {
    > button {
      width: 50px;
      > p {
        display: none;
      }
    }
  }
`;
