import styled, { keyframes } from 'styled-components';

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  width: 100%;
  padding: 6vh 0 10vh;

  animation: ${textAnimation} 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;

  @media (max-width: 539.9px) {
    padding: 4vh 6vw;
  }
`;

export const AssistanceTitle = styled.h1`
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.title.small}px;
  font-weight: 700;
  line-height: 49px;

  margin-bottom: 12px;

  @media (max-width: 767.9px) {
    font-size: ${({ theme }) => theme.fonts.size.title.tiny}px;
  }

  @media (max-width: 539.9px) {
    font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
  }

  @media (max-width: 359.9px) {
    font-size: ${({ theme }) => theme.fonts.size.title.tiny}px;
  }
`;

export const AssistanceSubtitle = styled.h2`
  color: ${({ theme }) => theme.colors.blue.opacity.average};

  font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
  font-weight: 400;
  line-height: 34px;

  @media (max-width: 767.9px) {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
  }
`;
