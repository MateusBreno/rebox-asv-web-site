// ./src/pages/privates/Contract/New/StepPayment/styles.ts
import { Form } from '@unform/web';
import styled from 'styled-components';

export const Container = styled.div``;

export const DividingLine = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 4vh 0;
`;

export const SectionsPayment = styled.div`
  width: 100%;
  padding: 2vh 0 4vh;
`;

export const FormPayment = styled(Form)``;

export const DueDate = styled.div`
  padding: 4vh 0 6vh;
`;

export const DueDateGroup = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 2vh;
  padding: 3vh 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const PaymentMethod = styled.div``;

export const PaymentMethodOptions = styled.div`
  width: 100%;
  display: flex;
  padding: 3vh 0;

  @media (max-width: 540px) {
    flex-direction: column;
    > div {
      margin-bottom: 2vh;
    }
  }
`;

export const PaymentMethodGroup = styled.div`
  background-color: ${({ theme }) => theme.colors.white.main};
  border-radius: 8px;
  padding: 6vh 4vw;

  @media (max-width: 768px) {
    padding: 6vh 8vw;
  }
`;

export const PaymentMethodGroupFields = styled.div`
  max-width: 40%;

  @media (max-width: 940px) {
    max-width: 60%;
  }

  @media (max-width: 768px) {
    max-width: 75%;
  }

  @media (max-width: 540px) {
    max-width: 100%;
  }
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

export const Discount = styled.div`
  padding: 3vh 0 0;
`;

export const DiscountButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh;

  svg {
    margin-right: 8px;
  }
`;

export const DiscountGroup = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white.main};
  border-radius: 8px;
  padding: 6vh 4vw;
  margin-top: 1.5vh;
`;

export const DiscountFields = styled.div`
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

export const DiscountItem = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 2vh 0;
  }
`;

export const Buttons = styled.div`
  display: flex;
  padding: 2vh 0 4vh;

  > button {
    margin-right: 10px;
  }

  @media (max-width: 380px) {
    flex-direction: column;
    align-items: center;

    > button {
      margin: 0;
      margin-bottom: 2vh;
    }
  }
`;
