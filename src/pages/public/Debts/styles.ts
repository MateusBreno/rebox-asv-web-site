import styled, { css } from 'styled-components';

interface IContainerProps {
  sidebarIsOpen: boolean;
}

interface ICommonQuestions {
  isActive: boolean;
}

export const Container = styled.div<IContainerProps>`
  background: ${({ theme }) => theme.colors.white.main};
  height: 100vh;

  overflow: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 'hidden' : 'auto')};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  margin: 0 auto;

  width: 100%;

  padding: 0 20px;

  @media (min-width: 1024px) {
    padding: 0;
  }

  @media (max-width: 479.9px) {
    padding: 0 10vw;
  }
`;

export const Information = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8vh 0;

  > svg {
    max-width: 260px;
    max-height: 260px;
  }

  @media (max-width: 768px) {
    padding: 6vh 0 3vh;
    > svg {
      display: none;
    }
  }
`;

export const InformationText = styled.div`
  padding: 0 4vw;

  > form {
    padding: 4vh 0;
    margin: 0 auto;
    max-width: 350px;

    > button {
      margin-top: 2vh;
    }
  }
`;

export const InformationTextTitle = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
  font-weight: 700;
`;

export const InformationTextSubtitle = styled.h2`
  font-weight: normal;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
  line-height: 29px;
  color: ${({ theme }) => theme.colors.blue.opacity.high};

  max-width: 805px;

  margin-top: 22px;
`;

export const Contracts = styled.div`
  width: 100%;
  padding: 12vh 12vw;

  @media (max-width: 768px) {
    padding: 6vh 0;
  }
`;

export const ContractsTitle = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.blue.opacity.high};
  font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
  font-weight: 700;
  margin-bottom: 4vh;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  }
`;

export const ContractsSubtitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.title.small}px;
  font-weight: 700;
  margin: 4vh 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
    line-height: 30px;
    margin: 4vh 0 0;
  }
`;

export const ContractsItems = styled.div`
  padding: 8vh 0;

  @media (max-width: 768px) {
    padding: 3vh 0;
  }
`;

export const ContractsItemsNoInfo = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.blue.opacity.high};
  margin-top: 8vh;
`;

export const ContractsItemsList = styled.div`
  /* padding: 6vh 8vw; */
  @media (max-width: 768px) {
    padding: 6vh 0;
  }
`;

export const ContractsItemsListItem = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ContractsItemsListItemTouch = styled.button<ICommonQuestions>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5vh 4vw;
  background-color: ${({ theme }) => theme.colors.white.main};

  > div {
    > p {
      text-align: start;
      color: ${({ theme }) => theme.colors.black.main};
      font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
      font-weight: 400;
      margin-top: 1vh;
    }

    > span {
      text-align: start;
      color: ${({ theme }) => theme.colors.black.main};
      font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
      font-weight: 600;
    }
  }
  > svg {
    max-width: 20px;
    max-height: 20px;
    transition: 500ms;
    path {
      fill: ${({ theme }) => theme.colors.blue.main};
    }
  }

  ${props =>
    props.isActive &&
    css`
      background-color: ${({ theme }) => theme.colors.whiteCloud.main};

      > svg {
        transform: rotate(180deg);
      }
    `}

  @media (max-width: 768px) {
    > div {
      > span {
        font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
      }
    }
  }
`;

export const ContractsItemsListItemDescription = styled.div<ICommonQuestions>`
  overflow: hidden;
  max-height: 0;
  /* pointer-events: none; */
  transition: max-height 400ms ease-in-out;

  ${props =>
    props.isActive &&
    css`
      max-height: 2000px;
      transition: max-height 400ms ease-in;
    `}
`;
