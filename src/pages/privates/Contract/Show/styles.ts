// ./src/pages/privates/Contract/Show/styles.ts
import { Form } from '@unform/web';
import styled, { css } from 'styled-components';

interface IProps {
  isActive?: boolean;
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

export const Tabs = styled.div`
  width: 100%;
  margin-top: 4vh;

  @media (max-width: 540px) {
    margin-top: 1vh;
  }
`;

export const TabLabels = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TabLabelsButton = styled.button<IProps>`
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

export const TabItems = styled.div``;

export const TabItemsGroup = styled.div``;

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
