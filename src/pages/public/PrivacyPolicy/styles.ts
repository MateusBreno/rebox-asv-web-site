import styled from 'styled-components';

interface IContainerProps {
  sidebarIsOpen: boolean;
}

export const Container = styled.div<IContainerProps>`
  background: ${({ theme }) => theme.colors.white.main};
  height: 100vh;

  overflow: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 'hidden' : 'auto')};
`;

export const Content = styled.div`
  font-family: ${({ theme }) => theme.fonts.family.Quicksand};
  padding: 4vh 12vw;
  line-height: 1.8;
  text-align: justify;

  @media (max-width: 539.9px) {
    padding: 4vh 8vw;
  }

  p {
    margin: 0 15px 15px 30px;
  }

  li,
  h3,
  h3 + p,
  h3 + p + p {
    margin: 0 15px 15px 70px;
  }

  h3 {
    color: ${({ theme }) => theme.colors.blue.main};
    margin: 0 15px 15px 30px;

    @media (max-width: 539.9px) {
      text-align: start;
      margin-top: 4vh;
    }
  }

  a:hover {
    font-size: 18px;
  }
`;

export const Title = styled.h1`
  /* font-weight: normal; */
  font-size: ${({ theme }) => theme.fonts.size.title.small}px;
  line-height: 29px;
  color: ${({ theme }) => theme.colors.blue.main};

  margin: 3vh 15px 15px 30px;

  @media (max-width: 539.9px) {
    text-align: start;
    margin-top: 10vh;
  }
`;

export const Subtitle = styled.h2`
  /* font-weight: normal; */
  font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
  line-height: 29px;
  color: ${({ theme }) => theme.colors.blue.main};

  margin: 3vh 15px 15px 30px;

  @media (max-width: 539.9px) {
    text-align: start;
    margin-top: 6vh;
  }
`;
