import React, { useCallback, useEffect, useState, useRef } from 'react';

import { BsCartX } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  HeaderNavigationPublic,
  MenuSideBarPublic,
  HeaderWizardNewSale,
  ButtonDefault,
  TitleMain,
  TitleSecondary,
  ButtonMain,
  ButtonOutline,
} from '@components/index';

// import StepConclusion from './StepConclusion';
import { ConfigRoutes } from '@config/index';
import { newContractStorageService } from '@services/index';
import { toastify } from '@utils/notifiers';

import StepCustomer from './StepCustomer';
import StepFinished from './StepFinished';
import StepPayment from './StepPayment';
// import StepProduct from './StepProduct';
import StepVehicle from './StepVehicle';

import { Container, Content, Options, OptionsGroup, Sections } from './styles';

const Checkout: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { push } = useHistory();

  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [stepHistory, setStepHistory] = useState<number>(1);

  const changeStep = (desiredStep: number) => {
    setStep(desiredStep);
  };
  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  const handleChangeSteps = useCallback(
    (desiredStep: number, willChangeHistory?: boolean) => {
      setStep(desiredStep);
      if (stepHistory < desiredStep || willChangeHistory)
        setStepHistory(desiredStep);
    },
    [stepHistory],
  );

  const handleToAbandon = useCallback(() => {
    newContractStorageService.cleanMany('all');
    toastify('A compra foi encerrada. Seu carrinho está vazio.', 'success');
    push(ConfigRoutes.rebox.publics.plan.path);
  }, []);

  useEffect(() => {
    contentRef.current?.scrollIntoView();
  }, [step]);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />

      <Content ref={contentRef}>
        <TitleSecondary textAlign="start">Checkout</TitleSecondary>
        <Options>
          <OptionsGroup>
            <ButtonDefault
              iconLeft={IoArrowBack}
              onClick={() => push(ConfigRoutes.rebox.publics.plan.path)}
              tabIndex={1}
            >
              Ver planos
            </ButtonDefault>
          </OptionsGroup>
          {step !== 4 && (
            <OptionsGroup>
              <ButtonDefault iconLeft={BsCartX} onClick={handleToAbandon}>
                Abandonar
              </ButtonDefault>
            </OptionsGroup>
          )}
        </Options>
        <HeaderWizardNewSale
          stepActive={step}
          stepHistory={stepHistory}
          changeStep={changeStep}
        />

        <Sections>
          {step === 1 && (
            <StepCustomer
              myStep={1}
              currentStep={step}
              changeStep={handleChangeSteps}
            />
          )}

          {step === 2 && (
            <StepVehicle
              myStep={2}
              currentStep={step}
              changeStep={handleChangeSteps}
            />
          )}

          {step === 3 && (
            <StepPayment
              myStep={3}
              currentStep={step}
              changeStep={handleChangeSteps}
            />
          )}

          {/* {step === 4 && (
            <StepFinished
              myStep={4}
              currentStep={step}
              changeStep={handleChangeSteps}
            />
          )} */}
        </Sections>
      </Content>
    </Container>
  );
};

export default Checkout;
