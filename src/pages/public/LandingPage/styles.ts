import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IContainerProps {
  sidebarIsOpen: boolean;
}

export const Container = styled.div<IContainerProps>`
  background: ${({ theme }) => theme.colors.white.main};
  height: 100vh;

  overflow: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 'hidden' : 'auto')};
`;

export const QuestionInformation = styled.section`
  padding: 4vh 8vw 0;
`;

export const QuestionTitle = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
  font-weight: 700;
`;

export const QuestionItems = styled.div`
  padding: 4vh 2vw;
`;

export const QuestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4.2vw;

  > svg {
    max-width: 400px;
    max-height: 400px;
  }

  > div {
    padding: 0 3vw;

    > span {
      color: ${({ theme }) => theme.colors.blue.opacity.average};
      font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
      font-weight: 500;
      line-height: 25px;
    }

    > p {
      margin-top: 1.5vh;
      color: ${({ theme }) => theme.colors.black.main};
      font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
      font-weight: 700;
      line-height: 30px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    > svg {
      max-width: 300px;
      max-height: 300px;
    }

    > div {
      span {
        font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
      }

      p {
        font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
      }
    }
  }
`;

export const SolutionsInformation = styled.section`
  > svg {
    path {
    }
    path.st1 {
      stroke: ${({ theme }) => theme.colors.blue.main};
    }
  }
`;

export const SolutionsInformationBox = styled.div`
  padding: 12vh 12vw 6vh;

  @media (max-width: 768px) {
    padding: 6vh 12vw;
  }
`;

export const SolutionsTitle = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.blue.opacity.high};
  font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
  font-weight: 700;
  margin-bottom: 4vh;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  }
`;

export const SolutionsSubtitle = styled.h2`
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

export const SolutionsBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8vh 0;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 4vh 0 8vh;
  }

  > svg {
    max-width: 300px;
    max-height: 300px;
  }
`;

export const SolutionsBoxItems = styled.div`
  margin-left: 8vw;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const SolutionsItem = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 9.5fr;
  margin-bottom: 5vh;
  align-items: center;
  justify-content: center;

  > svg {
    max-width: 50px;
    max-height: 50px;
  }
`;

export const SolutionsItemDescription = styled.div`
  margin-left: 4vw;
  > p {
    text-align: start;
    color: ${({ theme }) => theme.colors.blue.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 600;
    margin-bottom: 1vh;
  }

  > span {
    text-align: start;
    color: ${({ theme }) => theme.colors.black.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    font-weight: 400;
  }
`;

export const ChoosePlanLink = styled(Link)``;

export const ButtonChoosePlan = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 100%;
  max-width: 300px;
  padding: 0 15px;
  margin: 0 auto;
  border: 2px solid ${({ theme }) => theme.colors.blue.main};
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  font-weight: 500;

  :hover {
    color: ${({ theme }) => theme.colors.black.main};
    border: 2px solid ${({ theme }) => theme.colors.black.main};
  }
`;

export const Affiliate = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.blue.main};
  min-height: 350px;
  text-align: center;
  padding: 8vh 12vw 4vh;
  position: relative;

  h1 {
    color: #fff;
    font-size: ${({ theme }) => theme.fonts.size.title.small}px;
    font-weight: 700;
    margin-bottom: 4vh;
  }

  p {
    color: #fff;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 500;
    margin-bottom: 6vh;
  }

  p.legend {
    margin-bottom: 0;
    position: absolute;
    bottom: 3vh;
    left: 2vw;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
    opacity: 0.7;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 100%;
    max-width: 230px;
    padding: 0 15px;
    margin: 0 auto;
    border: 1px solid #fff;
    border-radius: 30px;
    color: #fff;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 500;

    :hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    padding: 8vh 12vw 10vh;
  }
`;
