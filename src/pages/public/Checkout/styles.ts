import styled from 'styled-components';

interface IContainerProps {
  sidebarIsOpen: boolean;
}

export const Container = styled.div<IContainerProps>`
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  height: 100vh;
  overflow: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 'hidden' : 'auto')};
`;

export const Content = styled.div`
  padding: 4vh 10vw;
  height: calc(100% -100px);

  @media (max-width: 768px) {
    padding: 4vh 5vw;
  }
`;

export const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4vh;
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .btn-update {
    margin-right: 0.5vw;
    min-width: 140px;
  }

  @media (max-width: 540px) {
    .btn-update {
      margin-right: 2vw;
      min-width: auto;
    }
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

export const Sections = styled.div``;
