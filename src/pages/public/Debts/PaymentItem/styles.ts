import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface IPropsStatus {
  isPending: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const NoInfo = styled.p``;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4vh 4vw;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 380px) {
    display: flex;
    flex-direction: column;
  }
`;

export const ItemDueDate = styled.div`
  padding: 2vh 2vw;

  > p {
    color: ${({ theme }) => theme.colors.blue.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 600;
  }
`;

export const ItemStatus = styled.div<IPropsStatus>`
  padding: 2vh 3vw;
  border-radius: 10px;
  background-color: rgba(231, 76, 60, 0.1);

  > p {
    color: #e74c3c;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    font-weight: 500;
  }

  ${props =>
    props.isPending &&
    css`
      background-color: ${({ theme }) => theme.colors.blue.opacity.veryLow};
      > p {
        color: ${({ theme }) => theme.colors.blue.main};
      }
    `}
`;

export const ItemAmount = styled.div`
  padding: 2vh 2vw;

  > p {
    color: ${({ theme }) => theme.colors.black.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
    font-weight: 600;
  }
`;

export const ItemButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 2vw;

  > p {
    color: ${({ theme }) => theme.colors.blue.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    font-weight: 600;
  }
`;

export const ItemButtonsLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 1.5vw;
  margin-right: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.blue.main};
  cursor: pointer;

  > svg {
    max-width: 16px;
    max-height: 16px;

    path {
      fill: ${({ theme }) => theme.colors.white.main};
    }
  }
  > p {
    margin-left: 5px;
    color: ${({ theme }) => theme.colors.white.main};
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 2vh 3vw;
    flex-direction: column;

    > p {
      margin-left: 0;
      margin-top: 5px;
    }
  }

  @media (max-width: 420px) {
    padding: 2vh 6vw;
  }
`;
