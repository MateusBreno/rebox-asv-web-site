import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const buttonAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(2px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const textAnimation = keyframes`
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

export const Container = styled.div`
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 4vh 2vw;
  padding: 0 12vw;

  > button {
    > svg {
      flex: 1;
    }

    @media (max-width: 767.9px) {
      > svg {
        width: 35px;
        margin-right: 6vw;
      }
    }
  }

  @media (max-width: 767.9px) {
    padding: 0 8vw;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 539.9px) {
    padding: 0 6vw;
  }

  @media (max-width: 479.9px) {
    grid-gap: 2vh 2vw;
    grid-template-areas: 'guincho guincho' 'pneu bateria' 'chaveiro combustivel' 'mecanico .';

    > button {
      max-width: 100%;
      justify-content: space-evenly;
      padding: 2vh 4vw;

      > svg {
        flex: 0.4;
        margin-right: 4vw;
      }

      > p {
        text-align: start;
      }
    }

    > .winch {
      grid-area: guincho;

      > svg {
        flex: 1;
      }

      > p {
        font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
      }
    }
  }
`;

export const Card = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: ${({ theme }) => theme.colors.white.main};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0px 30px;
  max-width: 300px;
  padding: 3vh 3vw;
  transition: 180ms ease-in;
  :hover {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
    animation: ${buttonAnimation} 1s;
  }
`;

export const CardText = styled.p`
  flex: 1;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.blue.main};
  text-transform: uppercase;
  animation: ${textAnimation} 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;

  @media (max-width: 767.9px) {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
  }
`;
