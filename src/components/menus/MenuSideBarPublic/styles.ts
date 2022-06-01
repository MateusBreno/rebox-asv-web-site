import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 4;

  transform: translateX(50%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.8s;

  &.sidebar-opened {
    transform: translateX(0%);
    opacity: 1;
    pointer-events: all;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 100%;

  height: 140px;
  padding: 0 20px;
`;

export const IconMenuClose = styled(FiX)`
  display: flex;
  cursor: pointer;

  color: #212121;

  transition: 180ms ease-in;

  :hover {
    color: #000000;
  }
`;

export const Navbar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  margin-top: -140px;
`;

export const BorderBottom = styled.div`
  width: 0%;
  height: 2px;
  background: #07359b;
  transition: width 0.3s;
`;

export const NavbarText = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #1d1d1d;
  font-size: 20px;
  font-weight: 600;
  line-height: 24, 38px;

  margin-bottom: 40px;

  text-decoration: none;
  transition: 180ms ease-in;

  :hover {
    color: #000;

    ${BorderBottom} {
      width: 100%;
    }
  }

  :active {
    transform: translateY(0);
  }
`;

export const ButtonAreaClient = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    270deg,
    rgba(7, 53, 155, 0.7) 2.02%,
    #07359b 100%
  );

  height: 55px;
  width: 230px;

  border-radius: 15px;
  border: 0;

  transition: 180ms ease-in;

  > svg {
    margin-right: 12px;
  }

  :hover {
    transform: translateY(2px);
  }

  :active {
    transform: translateY(0);
  }
`;

export const ButtonAreaClientText = styled.p`
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.family.Quicksand};
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
`;
