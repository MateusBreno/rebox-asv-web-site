// ./src/pages/privates/Contract/New/StepVehicle/index.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
  InputMask,
  AlertSimpleCustom,
} from '@components/index';
import { ConfigTransition } from '@config/index';
import Vehicle from '@models/Vehicle';
import { newContractStorageService, apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { hotToast, toastify } from '@utils/notifiers';

import FormVehicleNew from './FormVehicleNew';

import {
  Container,
  Tabs,
  TabLabels,
  TabLabelsButton,
  TabLabelsDivisor,
  TabItems,
  TabItemsGroup,
  FormValidate,
  Resume,
  SectionsGroup,
  SectionsField,
  DividingLine,
  Buttons,
} from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const StepVehicle: React.FC<IProps> = ({ myStep, currentStep, changeStep }) => {
  const formRef = useRef<FormHandles>(null);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [tab, setTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>('');

  return (
    <Container>
      <SubtitleSecondary textAlign="start">Dados do veículo</SubtitleSecondary>
      <Paragraph
        textAlign="start"
        nameColor="black"
        opacity={0.8}
        fontWeight={500}
      >
        Agora nos diga. Vamos cuidar juntos de qual veículo?
      </Paragraph>

      <FormVehicleNew
        forNewSale={{
          advanceStep: () => {
            changeStep(currentStep + 1);
            setTab(1);
          },
        }}
      />

      <Buttons>
        <ButtonDefault
          onClick={() => changeStep(currentStep - 1)}
          style={{ maxWidth: 200 }}
          disabled={currentStep <= 1}
          isDisable={currentStep <= 1}
        >
          Voltar
        </ButtonDefault>
      </Buttons>
    </Container>
  );
};

export default StepVehicle;
