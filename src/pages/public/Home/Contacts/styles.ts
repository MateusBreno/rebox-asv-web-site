import styled from 'styled-components';

export const Container = styled.div`
  display: block;
  align-items: center;
  justify-content: center;

  margin-top: 40px;

  padding: 0 20px;

  @media (min-width: 768px) {
    display: flex;

    margin-top: 106px;
  }

  @media (min-width: 1000px) {
    padding: 0 0;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    width: 30px;

    :first-child {
      margin-right: 25px;
    }
  }

  & + & {
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    & + & {
      margin-top: 0px;
      margin-left: 114px;
    }
  }
`;

export const Info = styled.div`
  text-align: center;
`;

export const TextGray = styled.h2`
  color: ${({ theme }) => theme.colors.black.main};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.extraLarge}px;
  line-height: 37px;
`;

export const TextBlue = styled.h1`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.title.small}px;
  line-height: 49px;
`;
