// ./src/components/forms/FormProfileAddress/styles.ts
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Content = styled.div`
  width: 100%;
`;

export const FormAddress = styled(Form)`
  max-width: 500px;
  margin-top: 4vh;
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3vh;
  padding: 0 0 2vh;
`;

export const LinkSearchCep = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0;
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
