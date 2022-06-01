// ./src/components/modals/ModalCalledGoBack/index.tsx
import React, { useCallback, useState, useMemo } from 'react';

import { IoClose } from 'react-icons/io5';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
} from '@components/index';
import { ConfigTransition, ConfigValues } from '@config/index';
import Called from '@models/Called';
import { apiRebox } from '@services/index';
import { hotToast, toastify } from '@utils/notifiers';

import { Container, ModalGoBack, Buttons } from './styles';

interface IProps {
  called: Called;
  isOpen: boolean;
  change(): void;
  refresh(): void;
}

const ModalCalledGoBack: React.FC<IProps> = ({
  called: calledData,
  isOpen,
  change,
  refresh,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [called, setCalled] = useState<Called>(calledData);

  const previousStatus = useMemo(() => {
    const { open, in_progress, in_attendance } =
      ConfigValues.rebox.called.status;
    if (called.status === in_attendance) return in_progress;
    if (called.status === in_progress) return open;

    return ``;
  }, [called]);

  const handleGoBackToInProgress = useCallback(async () => {
    const idHotToast = hotToast(`Retrocedendo acionamento`, 'loading');
    try {
      setLoading(prevState => !prevState);

      const { data: response } = await apiRebox.put(`/called/${called.id}`, {
        users_id: called.users_id,
        contracts_id: called.contracts_id,
        vehicles_id: called.vehicles_id,
        date_created: called.date_created,
        appointment_date: called.appointment_date,
        type: called.type,
        services_id: called.services_id,
        vehicle_situation: called.vehicle_situation,
        source_address_id: called.source_address_id,
        destination_address_id: called.destination_address_id,
        location_type: called.location_type,
        description: called.description,
        budget_amount: called.budget_amount,
        status: ConfigValues.rebox.called.status.in_progress,
        call_initiation_date: called.call_initiation_date,
        estimated_hours_for_initiation: called.estimated_hours_for_initiation,
        service_start_date: null,
        estimated_hours_for_service_start: null,
        closing_date: null,
        who_is_requesting_id: called.who_is_requesting_id,
        who_is_answering_id: called.who_is_answering_id,
        who_is_performing_the_service_id:
          called.who_is_performing_the_service_id,
        technical_report: null,
      });

      const { header, data: calledUpdated } = response;
      setCalled(calledUpdated);
      toastify(
        'Retrocedemos o acionamento para fase de atendimento com sucesso!',
        'success',
      );
      change();
      refresh();
    } catch (error: any) {
      let messageError = `Sinto muito, não foi possível retroceder para a fase de atendimento.`;
      if (error.response) messageError = error.response.data.error;
      toastify(messageError, `error`);
    } finally {
      hotToast(idHotToast, 'dismiss');
      setLoading(prevState => !prevState);
    }
  }, [called]);

  const handleGoBackToOpen = useCallback(async () => {
    const idHotToast = hotToast(`Retrocedendo acionamento`, 'loading');
    try {
      setLoading(prevState => !prevState);

      const { data: response } = await apiRebox.put(`/called/${called.id}`, {
        users_id: called.users_id,
        contracts_id: called.contracts_id,
        vehicles_id: called.vehicles_id,
        date_created: called.date_created,
        appointment_date: called.appointment_date,
        type: called.type,
        services_id: called.services_id,
        vehicle_situation: called.vehicle_situation,
        source_address_id: called.source_address_id,
        destination_address_id: called.destination_address_id,
        location_type: called.location_type,
        description: called.description,
        budget_amount: called.budget_amount,
        status: ConfigValues.rebox.called.status.open,
        call_initiation_date: null,
        estimated_hours_for_initiation: null,
        service_start_date: null,
        estimated_hours_for_service_start: null,
        closing_date: null,
        who_is_requesting_id: called.who_is_requesting_id,
        who_is_answering_id: null,
        who_is_performing_the_service_id: null,
        technical_report: null,
      });

      const { header, data: calledUpdated } = response;
      setCalled(calledUpdated);
      toastify(
        'Retrocedemos o acionamento para fase inicial com sucesso!',
        'success',
      );
      change();
      refresh();
    } catch (error: any) {
      let messageError = `Sinto muito, não foi possível retroceder para a fase inicial.`;
      if (error.response) messageError = error.response.data.error;
      toastify(messageError, `error`);
    } finally {
      hotToast(idHotToast, 'dismiss');
      setLoading(prevState => !prevState);
    }
  }, [called]);

  return (
    <Container>
      <ModalGoBack
        isOpen={isOpen}
        onRequestClose={change}
        contentLabel="GoBack"
      >
        <ButtonDefault
          iconLeft={IoClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            maxWidth: 50,
            padding: 0,
          }}
          onClick={change}
        />
        {previousStatus === ConfigValues.rebox.called.status.in_progress && (
          <>
            <SubtitleSecondary>
              Voltar para{' '}
              {`"${
                ConfigTransition.rebox_called_status[
                  previousStatus.toLowerCase()
                ]
              }"`.toLowerCase()}
            </SubtitleSecondary>
            <Paragraph
              nameColor="black"
              opacity={0.5}
              style={{ marginTop: '2vh' }}
            >
              Estaremos retrocedendo para a fase de atendimento, onde o
              prestador está a caminho.
            </Paragraph>

            <Buttons>
              <ButtonMain
                loading={loading}
                style={{ marginRight: '1vw' }}
                onClick={handleGoBackToInProgress}
              >
                Retroceder
              </ButtonMain>
              <ButtonDefault type="button" onClick={change}>
                Voltar
              </ButtonDefault>
            </Buttons>
          </>
        )}
        {previousStatus === ConfigValues.rebox.called.status.open && (
          <>
            <SubtitleSecondary>
              Voltar para{' '}
              {`"${
                ConfigTransition.rebox_called_status[
                  previousStatus.toLowerCase()
                ]
              }"`.toLowerCase()}
            </SubtitleSecondary>
            <Paragraph
              nameColor="black"
              opacity={0.5}
              style={{ marginTop: '2vh' }}
            >
              Estaremos retrocedendo para a fase de inicial, na escolha de um
              prestador.
            </Paragraph>

            <Buttons>
              <ButtonMain
                loading={loading}
                style={{ marginRight: '1vw' }}
                onClick={handleGoBackToOpen}
              >
                Retroceder
              </ButtonMain>
              <ButtonDefault type="button" onClick={change}>
                Voltar
              </ButtonDefault>
            </Buttons>
          </>
        )}
      </ModalGoBack>
    </Container>
  );
};

export default ModalCalledGoBack;
