// ./src/pages/privates/User/Customer/Show/styles.ts
import { Form } from '@unform/web';
import styled, { css } from 'styled-components';

interface ITabLabelsButton {
  isActive?: boolean;
}

interface ISubTabLabelsButton {
  isActive?: boolean;
}

interface ITabLabelsIndicator {
  countAnimated: number;
  enable: boolean;
}

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

  /* @media (max-width: 540px) {
    flex-direction: column;

    > button {
      margin-right: 0;
      margin-bottom: 1vh;
    }
  } */
`;

export const Details = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 4vh 0;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    align-items: center;
  }
`;

export const DetailsGroup = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const DetailsInformation = styled.div`
  padding: 0 2vw 0 4vw;
  width: 100%;

  @media (max-width: 480px) {
    > div p {
      text-align: center;
    }

    .btn-copy-code p {
      justify-content: center;
    }
  }
`;

export const Avatar = styled.div`
  @media (max-width: 540px) {
    width: 100%;
    flex: 1;
    margin-bottom: 2vh;
  }
`;

export const AvatarProfile = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  input {
    display: none;
  }
  @media (max-width: 480px) {
    justify-content: center;
  }
`;

export const AvatarProfileGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
`;

export const AvatarProfileLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0px;
  right: -8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.white.main};
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

export const AvatarProfileImage = styled.img`
  margin-right: 1vw;
  width: 100px;
  height: 100px;
  border-radius: 50%;

  /* @media (max-width: 359.9px) {
    width: 28px;
    height: 28px;
  } */
`;

export const AvatarProfileAttachment = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  cursor: pointer;
`;

export const AvatarInputAttachment = styled.input``;

export const Balance = styled.div`
  min-width: 170px;
  padding: 2vh 2vw;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media (max-width: 480px) {
    width: 100%;
    margin-top: 2vh;
    p {
      text-align: center;
    }
  }
`;

export const Tabs = styled.div`
  width: 100%;
`;

export const TabLabels = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const TabLabelsButton = styled.button<ITabLabelsButton>`
  display: flex;
  align-items: center;
  height: 60px;
  min-width: 120px;
  padding: 2vh 3vw;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.black.opacity.veryLow};
  transition: ease-in 300ms;

  svg {
    margin-right: 5px;
  }

  svg,
  p {
    color: ${({ theme }) => theme.colors.black.opacity.average};
  }

  :hover {
    svg,
    p {
      color: ${({ theme }) => theme.colors.black.opacity.high};
    }
  }

  ${({ isActive }) =>
    isActive &&
    css`
      border-bottom: 2px solid ${({ theme }) => theme.colors.blue.main};
      svg,
      p {
        color: ${({ theme }) => theme.colors.blue.main};
      }

      :hover {
        svg,
        p {
          color: ${({ theme }) => theme.colors.blue.main};
        }
      }
    `}
  @media (max-width: 960px) {
    p {
      font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    align-items: center;
    width: 60px;
    min-width: 60px;
    div {
      display: none;
    }
  }
`;

export const TabLabelsIndicator = styled.div<ITabLabelsIndicator>`
  display: none;
  position: absolute;
  top: 34%;
  transition: ease-in 200ms;
  left: ${({ countAnimated }) => countAnimated + 94}%;

  @media (max-width: 768px) {
    display: ${({ enable }) => (enable ? 'flex' : 'none')};
  }
`;

export const TabItems = styled.div``;

export const TabItemsGroup = styled.div``;

export const SubTabs = styled.div`
  width: 100%;
  margin-top: 5vh;
`;

export const SubTabLabels = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SubTabLabelsDivisor = styled.div`
  height: 25px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.black.opacity.low};
`;

export const SubTabLabelsButton = styled.button<ISubTabLabelsButton>`
  display: flex;
  align-items: center;
  padding: 0 3vw;
  transition: ease-in 300ms;

  p {
    color: ${({ theme }) => theme.colors.black.opacity.average};
  }

  :hover {
    p {
      color: ${({ theme }) => theme.colors.black.opacity.high};
    }
  }

  ${({ isActive }) =>
    isActive &&
    css`
      p {
        color: ${({ theme }) => theme.colors.black.main};
        font-weight: 500;
      }
    `}

  @media (max-width: 960px) {
    p {
      font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
    }
  }
`;

export const SubTabItems = styled.div``;

export const FormPage = styled(Form)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > div {
    height: 40px;
    border-radius: 0;

    > input {
      padding: 0 5px;
      max-width: 60px;
    }
  }
`;

export const Pagination = styled.div`
  display: flex;
  flex-direction: row;

  > button > p {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
  }
`;

export const PaginationGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const PaginationGroupText = styled.p`
  margin: 0;
  padding: 0 5px;
  word-break: break-word;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.black.main};
`;
