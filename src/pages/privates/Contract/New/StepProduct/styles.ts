// ./src/pages/privates/Contract/New/StepProduct/styles.ts
import styled from 'styled-components';

export const Container = styled.div``;

export const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 3vh;
  padding: 4vh 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

export const Buttons = styled.div`
  display: flex;
  padding: 2vh 0 4vh;
`;
