import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.footer`
  position: relative;

  margin-top: 20px;

  @media (min-width: 768px) {
    margin-top: 123px;
  }
`;

export const Background = styled.img`
  width: 80%;
  object-fit: cover;

  display: flex;

  @media (max-width: 539.9px) {
    width: 95%;
  }
`;

export const Content = styled.div`
  display: block;
  align-items: center;
  justify-content: center;

  width: 100%;

  position: absolute;
  bottom: 0;
  padding: 1vh 2vw;

  @media (min-width: 480px) {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 479.9px) {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 5fr 1fr;
    padding: 0.5vh 0;
  }
`;

export const TextTerms = styled(Link)`
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  font-weight: 500;
  text-align: left;
  color: #1d1d1d;

  text-align: center;

  margin-right: 20px;

  @media (min-width: 768px) {
    margin-right: 0;
  }

  @media (max-width: 539.9px) {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
    margin: 0;
    text-align: start;
    padding-left: 4vw;
  }

  @media (max-width: 379.9px) {
    text-align: start;
  }
`;

export const ContactUs = styled.div`
  /* position: fixed;
  right: 4vw;
  bottom: 3vh; */

  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    width: 31px;
    margin-right: 1vw;
  }

  transition: 180ms ease-in;

  :hover {
    transform: translateY(2px);
  }

  @media (max-width: 539.9px) {
    background-color: ${({ theme }) => theme.colors.white.main};
    border-top-left-radius: 50%;
    padding-top: 1vh;
  }
`;

export const ContactUsText = styled.p`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  line-height: 27px;
  color: #1d1d1d;

  @media (max-width: 539.9px) {
    display: none;
  }
`;
