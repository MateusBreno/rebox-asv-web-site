// ./src/components/lists/ListUserAffiliates/Item/styles.ts
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IDropdown {
  expande: boolean;
}

export const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2.6fr 1fr 0.6fr 1fr 0.1fr;
  column-gap: 1vw;
  justify-content: center;
  align-items: center;
  /* box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.05); */
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 3vh 2vw;
  position: relative;

  :hover {
    border-radius: 6px;
    background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white.main};
    border-top: 0;
    border-radius: 6px;

    :hover {
      background-color: ${({ theme }) => theme.colors.white.main};
    }

    .btn-options {
      position: absolute;
      top: 2vh;
      right: 3vw;
    }
  }
`;

export const CompositeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

export const CompositeItemText = styled.span`
  margin: 0;
  padding: 0;
  word-break: break-word;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.black.main};
  margin-left: 3px;
`;

export const Dropdown = styled.div<IDropdown>`
  display: ${({ expande }) => (expande ? 'block' : 'none')};
  background-color: ${({ theme }) => theme.colors.white.main};
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px 8px 8px 0;
  position: absolute;
  width: 100px;
  right: -60px;
  top: -15px;

  @media (max-width: 768px) {
    top: 30px;
    right: 40px;
    border-radius: 8px 0 8px 8px;
  }
`;

export const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 6px;
  padding: 1vh 1vw;

  :hover {
    background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  }
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 6px;
  padding: 1vh 1vw;

  :hover {
    background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  }
`;
