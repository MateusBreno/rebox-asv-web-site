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

export const WhoWeAre = styled.section`
  display: flex;
  align-items: center;
  padding: 5vh 12vw;

  div {
    svg {
      max-width: 300px;
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    div.banner {
      display: none;
    }
  }
`;

export const WhoWeAreInfomation = styled.div`
  padding-right: 4vw;

  @media (max-width: 768px) {
    grid-area: text;
  }
`;

export const WhoWeAreTitle = styled.h1`
  text-align: justify;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.title.small}px;
  font-weight: 700;
  margin-bottom: 2vh;
`;

export const WhoWeAreDescription = styled.div`
  p {
    text-align: justify;
    color: ${({ theme }) => theme.colors.black.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 400;
    margin-bottom: 2vh;
    line-height: 1.8;
  }
`;

export const CompanyConcepts = styled.section`
  padding: 0 12vw 5vh;
`;

export const Our = styled.div`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 100%;
  padding: 6vh 4vw;
  margin-bottom: 6vh;

  :hover {
    border: 1px solid ${({ theme }) => theme.colors.blue.main};
  }

  @media (max-width: 768px) {
    padding: 6vh 8vw;
  }
`;

export const OurTitle = styled.h1`
  text-align: justify;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.title.tiny}px;
  font-weight: 700;
  margin-bottom: 2vh;
`;

export const OurDescription = styled.div`
  p {
    text-align: justify;
    color: ${({ theme }) => theme.colors.black.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 400;
    margin-bottom: 2vh;
    line-height: 1.8;
  }
`;

export const Affiliate = styled.section`
  min-height: 300px;
  text-align: center;
  padding: 0 12vw 4vh;
  margin-bottom: 10vh;

  div.text-start {
    display: flex;
    justify-content: start;
    align-items: center;

    .link p {
      margin-left: 2vw;
      color: ${({ theme }) => theme.colors.blue.main};
      font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
      font-weight: 500;
      :hover {
        color: ${({ theme }) => theme.colors.black.main};
      }
    }
  }

  @media (max-width: 768px) {
    div.text-start {
      flex-direction: column;
      align-items: flex-start;
      .link p {
        margin-left: 0;
        margin-top: 4vh;
      }
    }
  }
`;

export const OurLink = styled(Link)``;

export const ButtonOur = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  max-width: 300px;
  padding: 0 4vw;
  border: 1px solid ${({ theme }) => theme.colors.blue.main};
  border-radius: 15px;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  font-weight: 500;

  :hover {
    color: ${({ theme }) => theme.colors.black.main};
    border: 1px solid ${({ theme }) => theme.colors.black.main};
  }
`;
