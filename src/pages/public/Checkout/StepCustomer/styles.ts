// ./src/pages/privates/Contract/New/Step/styles.ts
import styled, { css } from 'styled-components';

interface ITabLabelsButton {
  isActive?: boolean;
}

export const Container = styled.div``;

export const DividingLine = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 4vh 0;
`;

export const SectionsProduct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white.main};
  text-align: center;
  margin: 2vh 0 4vh;
  width: 100%;
  padding: 3vh 3vw;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.black.opacity.low};

  @media (max-width: 768px) {
    padding: 3vh 8vw;

    h4 {
      font-size: ${({ theme }) => theme.fonts.size.subtitle.small}px;
    }
  }
`;

export const SectionsProductTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2vh;

  > svg {
    margin-right: 6px;
  }
`;

export const SectionsProductGroup = styled.div`
  width: 100%;
`;

export const SectionsProductItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;

    p {
      text-align: start;
    }
  }
`;

export const SectionsIdentification = styled.div``;

export const SectionsIdentificationGroup = styled.div``;

export const SectionsIdentificationTitle = styled.div`
  margin-top: 4vh;
`;

export const SectionsIdentificationResume = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white.main};
  margin: 2vh 0 4vh;
  width: 100%;
  padding: 3vh 3vw;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.black.opacity.low};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  @media (max-width: 540px) {
    align-items: center;
  }
`;

export const SectionsIdentificationResumeGroup = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 768px) {
    margin-bottom: 2vh;
  }

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: center;

    p {
      text-align: center;
    }
  }
`;

export const SectionsIdentificationResumeImage = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 2vw;

  @media (max-width: 540px) {
    margin: 0;
    margin-bottom: 2vh;
  }
`;

export const SectionsIdentificationResumeImageAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const SectionsIdentificationResumeText = styled.div``;

export const Buttons = styled.div`
  display: flex;
  padding: 2vh 0 4vh;
`;
