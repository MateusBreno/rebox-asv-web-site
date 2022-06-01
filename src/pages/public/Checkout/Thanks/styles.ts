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

export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white.main};
  text-align: center;
  margin: 3vh 0;
  width: 100%;
  padding: 6vh 4vw;
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 4vh 8vw;

    h3 {
      font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
    }

    h4 {
      font-size: ${({ theme }) => theme.fonts.size.subtitle.small}px;
    }

    p {
      font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    }
  }
`;

export const SectionsImage = styled.img`
  width: 289px;
  margin-bottom: 2vh;

  @media (max-width: 768px) {
    width: 206px;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3vh 0;
`;
