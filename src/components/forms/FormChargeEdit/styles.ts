// ./src/components/forms/FormChargeEdit/styles.ts
import { Form } from '@unform/web';
import styled from 'styled-components';

/* VERSÃO MOBILE
 * - 1024px
 * - 960px
 * - 768px
 * - 540px
 * - 480px
 * - 360px
 * - 320px
 */

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

export const FormCharge = styled(Form)`
  width: 100%;
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
