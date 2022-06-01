// ./src/components/forms/FormUserAddress/styles.ts
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white.main};
  text-align: center;
  margin: 3vh 0;
  width: 100%;
  padding: 2vh 4vw 6vh;
  border-radius: 10px;
`;

export const FormAddress = styled(Form)`
  width: 100%;
`;

export const DividingLine = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 4vh 0;
`;

export const Sections = styled.div`
  width: 100%;
`;

export const SectionsGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10vw;
  padding: 3vh 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
`;

export const SectionsItem = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 2vh 0;
  }
`;

export const SectionsItemGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  svg {
    position: absolute;
    right: -25px;
  }
`;

export const LinkSearchCep = styled(Link)`
  display: flex;
  align-items: center;
  margin: 2vh 0 0;
  padding: 0;
  word-break: break-word;
  line-height: 24px;
  font-weight: 500;
  text-align: start;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.blue.main};

  :hover {
    color: ${({ theme }) => theme.colors.black.main};
  }
`;
