// ./src/pages/privates/Contract/New/StepFinished/index.tsx
import React from 'react';

import { LottieCheck } from '@assets/animations';
import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonOutline,
} from '@components/index';
import { newContractStorageService } from '@services/index';

import { Container, Buttons } from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const StepFinished: React.FC<IProps> = ({ changeStep }) => {
  const handleSellToNewCustomer = () => {
    newContractStorageService.cleanMany('all');
    changeStep(1, true);
  };

  const handleSellToTheSameCustomer = () => {
    newContractStorageService.cleanMany('vehicle');
    changeStep(3, true);
  };

  return (
    <Container>
      <LottieCheck />
      <SubtitleSecondary>Deu tudo certo!</SubtitleSecondary>
      <Paragraph nameColor="black" fontWeight={500}>
        Esta venda foi realizada com sucesso.
      </Paragraph>
      <Buttons>
        <ButtonMain
          onClick={handleSellToNewCustomer}
          style={{ maxWidth: '300px', marginBottom: '1.5vh' }}
        >
          Vender para novo cliente
        </ButtonMain>
        <ButtonOutline
          onClick={handleSellToTheSameCustomer}
          style={{ maxWidth: '300px' }}
        >
          Vender para mesmo cliente
        </ButtonOutline>
      </Buttons>
    </Container>
  );
};

export default StepFinished;
