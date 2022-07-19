// ./src/components/forms/FormCustomerEdit/styles.ts
import { Form } from '@unform/web';
import styled from 'styled-components';

// export const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: center;
//   background-color: ${({ theme }) => theme.colors.white.main};
//   text-align: center;
//   margin: 3vh 0;
//   width: 100%;
//   padding: 2vh 4vw 6vh;
//   border-radius: 10px;
// `;

export const FormCustomer = styled(Form)`
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

export const Container = styled.div`
  margin: 3vh 0;
`;

export const Table = styled.div`
  padding: 6vh 3vw 4vh;
  background-color: ${({ theme }) => theme.colors.white.main};
  border-radius: 6px;

  @media (max-width: 768px) {
    padding: 0;
    background-color: ${({ theme }) => theme.colors.whiteCloud.main};
    border-radius: 0;
  }
`;

export const Labels = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr 0.6fr 1fr 0.8fr 0.6fr 0.8fr 0.6fr 0.2fr;
  column-gap: 1vw;
  padding: 0 2vw 2vh;

  p {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Items = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1vw;
    row-gap: 1vw;
  }

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
  }
`;

export const NothingFound = styled.div`
  width: 100%;
  height: 100%;
  padding: 10vh 5vw 10vh;
  display: flex;
  justify-content: center;
`;
