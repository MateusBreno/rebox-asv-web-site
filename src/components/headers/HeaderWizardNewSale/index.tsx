// ./src/components/headers/HeaderWizardNewSale/index.tsx
import React, { useMemo } from 'react';

import { IoCheckmarkSharp } from 'react-icons/io5';

import { ConfigStyles } from '@config/index';

import {
  Container,
  Wizard,
  WizardItem,
  WizardItemIcon,
  WizardItemIconText,
  WizardItemLabel,
  WizardItemBar,
} from './styles';

interface IProps {
  stepActive: number;
  stepHistory: number;
  changeStep(desiredStep: number): void;
}

const HeaderWizardNewSale: React.FC<IProps> = ({
  stepActive,
  stepHistory,
  changeStep,
}) => {
  const stepProduct = useMemo(() => 1, []);
  const stepCustomer = useMemo(() => 2, []);
  const stepVehicle = useMemo(() => 3, []);
  const stepPayment = useMemo(() => 4, []);
  const stepConclusion = useMemo(() => 5, []);
  const stepFinished = useMemo(() => 6, []);

  const beClassProduct = useMemo(() => {
    if (stepActive === stepFinished) return 'will_come';

    if (stepActive > stepProduct) return 'passed_on';

    if (stepActive < stepProduct) return 'will_come';

    return 'now';
    // eslint-disable-next-line
  }, [stepActive]);

  const beClassCustomer = useMemo(() => {
    if (stepActive === stepFinished) return 'will_come';

    if (stepActive > stepCustomer) return 'passed_on';

    if (stepActive < stepCustomer) return 'will_come';

    return 'now';
    // eslint-disable-next-line
  }, [stepActive]);

  const beClassVehicle = useMemo(() => {
    if (stepActive === stepFinished) return 'will_come';

    if (stepActive > stepVehicle) return 'passed_on';

    if (stepActive < stepVehicle) return 'will_come';

    return 'now';
    // eslint-disable-next-line
  }, [stepActive]);

  const beClassPayment = useMemo(() => {
    if (stepActive === stepFinished) return 'will_come';

    if (stepActive > stepPayment) return 'passed_on';

    if (stepActive < stepPayment) return 'will_come';

    return 'now';
    // eslint-disable-next-line
  }, [stepActive]);

  const beClassConclusion = useMemo(() => {
    if (stepActive === stepFinished) return 'will_come';

    if (stepActive > stepConclusion) return 'passed_on';

    if (stepActive < stepConclusion) return 'will_come';

    return 'now';
    // eslint-disable-next-line
  }, [stepActive]);

  return (
    <Container>
      <Wizard>
        <WizardItem>
          <WizardItemIcon
            be={beClassProduct}
            onClick={() => changeStep(stepProduct)}
            disabled={stepHistory < stepProduct || stepActive === stepFinished}
          >
            {stepActive > stepProduct || stepHistory > stepProduct ? (
              <IoCheckmarkSharp color={ConfigStyles.rebox.colors.white.main} />
            ) : (
              <WizardItemIconText be={beClassProduct}>
                {stepProduct}
              </WizardItemIconText>
            )}
          </WizardItemIcon>
          <WizardItemLabel
            be={beClassProduct}
            onClick={() => changeStep(stepProduct)}
            disabled={stepHistory < stepProduct || stepActive === stepFinished}
          >
            Produto
          </WizardItemLabel>
          <WizardItemBar be={beClassCustomer} />
        </WizardItem>

        <WizardItem>
          <WizardItemIcon
            be={beClassCustomer}
            onClick={() => changeStep(stepCustomer)}
            disabled={stepHistory < stepCustomer || stepActive === stepFinished}
          >
            {stepActive > stepCustomer || stepHistory > stepCustomer ? (
              <IoCheckmarkSharp color={ConfigStyles.rebox.colors.white.main} />
            ) : (
              <WizardItemIconText be={beClassCustomer}>
                {stepCustomer}
              </WizardItemIconText>
            )}
          </WizardItemIcon>
          <WizardItemLabel
            be={beClassCustomer}
            onClick={() => changeStep(stepCustomer)}
            disabled={stepHistory < stepCustomer || stepActive === stepFinished}
          >
            Cliente
          </WizardItemLabel>
          <WizardItemBar be={beClassVehicle} />
        </WizardItem>

        <WizardItem>
          <WizardItemIcon
            be={beClassVehicle}
            onClick={() => changeStep(stepVehicle)}
            disabled={stepHistory < stepVehicle || stepActive === stepFinished}
          >
            {stepActive > stepVehicle || stepHistory > stepVehicle ? (
              <IoCheckmarkSharp color={ConfigStyles.rebox.colors.white.main} />
            ) : (
              <WizardItemIconText be={beClassVehicle}>
                {stepVehicle}
              </WizardItemIconText>
            )}
          </WizardItemIcon>
          <WizardItemLabel
            be={beClassVehicle}
            onClick={() => changeStep(stepVehicle)}
            disabled={stepHistory < stepVehicle || stepActive === stepFinished}
          >
            Veículo
          </WizardItemLabel>
          <WizardItemBar be={beClassPayment} />
        </WizardItem>

        <WizardItem>
          <WizardItemIcon
            be={beClassPayment}
            onClick={() => changeStep(stepPayment)}
            disabled={stepHistory < stepPayment || stepActive === stepFinished}
          >
            {stepActive > stepPayment || stepHistory > stepPayment ? (
              <IoCheckmarkSharp color={ConfigStyles.rebox.colors.white.main} />
            ) : (
              <WizardItemIconText be={beClassPayment}>
                {stepPayment}
              </WizardItemIconText>
            )}
          </WizardItemIcon>
          <WizardItemLabel
            be={beClassPayment}
            onClick={() => changeStep(stepPayment)}
            disabled={stepHistory < stepPayment || stepActive === stepFinished}
          >
            Pagamento
          </WizardItemLabel>
          <WizardItemBar be={beClassConclusion} />
        </WizardItem>

        <WizardItem>
          <WizardItemIcon
            be={beClassConclusion}
            onClick={() => changeStep(stepConclusion)}
            disabled={
              stepHistory < stepConclusion || stepActive === stepFinished
            }
          >
            {stepActive > stepConclusion || stepHistory > stepConclusion ? (
              <IoCheckmarkSharp color={ConfigStyles.rebox.colors.white.main} />
            ) : (
              <WizardItemIconText be={beClassConclusion}>
                {stepConclusion}
              </WizardItemIconText>
            )}
          </WizardItemIcon>
          <WizardItemLabel
            be={beClassConclusion}
            onClick={() => changeStep(stepConclusion)}
            disabled={
              stepHistory < stepConclusion || stepActive === stepFinished
            }
          >
            Conclusão
          </WizardItemLabel>
        </WizardItem>
      </Wizard>
    </Container>
  );
};

export default HeaderWizardNewSale;
