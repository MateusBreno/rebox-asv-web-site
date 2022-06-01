// ./src/pages/privates/Financial/Charge/Show/index.tsx
import React, { useCallback, useEffect, useState } from 'react';

import { IoArrowBack, IoBan, IoRepeatOutline, IoLink } from 'react-icons/io5';
import { useHistory, useParams } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonDefault,
  LoadingForm,
  FormChargeEdit,
  ButtonOutline,
  ModalChargeRestore,
  ModalChargeCancele,
} from '@components/index';
import { ConfigValues } from '@config/index';
import AsaasCharge from '@models/AsaasCharge';
import Payment from '@models/Payment';
import { apiRebox } from '@services/index';
import { toastify } from '@utils/notifiers';

import { IUrlParams } from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
} from './styles';

const ChargeShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: chargeId } = useParams<IUrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [charge, setCharge] = useState<Payment>({} as Payment);
  const [asaasCharge, setAsaasCharge] = useState<AsaasCharge>();

  const [
    modalChargeRevertIsOpen,
    setModalChargeRevertIsOpen,
  ] = useState<boolean>(false);

  const changeModalChargeRevertIsOpen = () => {
    setModalChargeRevertIsOpen(prevState => !prevState);
  };

  const getAsaasCharge = async () => {
    try {
      const { data: responseChargeAsaas } = await apiRebox.get(
        `/asaas/payment/${charge?.gateway_id}`,
      );
      setAsaasCharge(responseChargeAsaas.data);
    } catch (error) {
      console.error(
        `Error ao tentar buscar no asaas a cobrança ${charge?.gateway_id}`,
        error,
      );
    }
  };

  const getCharge = useCallback(async () => {
    try {
      setLoading(prevState => !prevState);
      const { data: responseCharge } = await apiRebox.get(
        `/payments/${chargeId}`,
      );
      setCharge(responseCharge.data);
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as os dados do veículo.',
        'error',
      );
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  const handleOpenBillingLink = () => {
    const url =
      charge?.status === ConfigValues.rebox.payments.status.received
        ? asaasCharge?.transactionReceiptUrl
        : asaasCharge?.invoiceUrl;
    window.open(url, '_blank');
  };

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getCharge();
  }, []);

  useEffect(() => {
    getAsaasCharge();
  }, [charge]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Cobrança</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoLink} onClick={handleOpenBillingLink}>
                {charge?.status === ConfigValues.rebox.payments.status.received
                  ? 'Comprovante'
                  : '2ª via'}
              </ButtonDefault>
              {charge?.status ===
              ConfigValues.rebox.payments.status.canceled ? (
                <ButtonDefault
                  iconLeft={IoRepeatOutline}
                  onClick={changeModalChargeRevertIsOpen}
                >
                  Restaurar
                </ButtonDefault>
              ) : (
                <>
                  {(charge?.status ===
                    ConfigValues.rebox.payments.status.pending ||
                    charge?.status ===
                      ConfigValues.rebox.payments.status.overdue) && (
                    <ButtonDefault
                      iconLeft={IoBan}
                      onClick={changeModalChargeRevertIsOpen}
                    >
                      Cancelar
                    </ButtonDefault>
                  )}
                </>
              )}
            </OptionsGroup>
          </Options>
          {loading ? <LoadingForm /> : <FormChargeEdit charge={charge} />}
        </Content>
      </ContainerGroup>
      {charge?.status === ConfigValues.rebox.payments.status.canceled ? (
        <ModalChargeRestore
          charge_id={chargeId}
          isOpen={modalChargeRevertIsOpen}
          change={changeModalChargeRevertIsOpen}
        />
      ) : (
        <ModalChargeCancele
          charge_id={chargeId}
          isOpen={modalChargeRevertIsOpen}
          change={changeModalChargeRevertIsOpen}
        />
      )}
    </Container>
  );
};

export default ChargeShow;
