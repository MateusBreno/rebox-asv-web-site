// src/components/forms/FormCommunication/index.tsx
import React, { useCallback, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  InputSelect,
  InputCheckBox,
  InputMask,
  ButtonMain,
} from '@components/index';
import { ConfigLabel, ConfigValues } from '@config/index';
import { apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatDate } from '@utils/formatters';
import { generateNumber } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import { schema } from './schemaValidation';
import { IFormData } from './typing';

import {
  Container,
  DividingLine,
  FormNotice,
  Sections,
  SectionsGroup,
  SectionsItem,
} from './styles';

const FormCommunication: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [byWhatsapp, setByWhatsapp] = useState<boolean>(true);
  const [byEmail, setByEmail] = useState<boolean>(true);
  const [bySms, setBySms] = useState<boolean>(true);
  const [moreFields, setMoreFields] = useState<boolean>(false);

  const [progress, setProgress] = useState<number>(0);

  const handleCommunicateCustomers = useCallback(
    async (data: IFormData) => {
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schema.validate(data, {
          abortEarly: false,
        });

        const limit = 10;

        const params = {
          method: '',
          days: 0,
          date: '',
          status: '',
          channels: {
            whatsapp: byWhatsapp ? 'ENABLED' : 'DISABLED',
            sms: bySms ? 'ENABLED' : 'DISABLED',
            email: byEmail ? 'ENABLED' : 'DISABLED',
          },
          per_page: limit,
        };

        if (data.methodAndDays === 'UNDEFINED') {
          params.method = 'UNDEFINED';
          params.date = formatDate.removeMask(data.due_date);
          params.status = data.status;
        } else {
          const [method, days] = data.methodAndDays.split(':');
          params.method = method;
          params.days = Number.parseInt(days, 10);
        }

        const { data: response } = await apiRebox.post(
          `/notifications/charges`,
          { ...params, page: 1 },
        );

        const { total } = response.header;

        const numberPages = Math.ceil(total / limit);
        const arrayPages: number[] = [];

        for (let i = 2; i <= numberPages; i++) {
          arrayPages.push(i);
        }

        const percentage: number = generateNumber.getPercentageByValue(
          arrayPages.length,
          1,
        );

        for await (const currentPage of arrayPages) {
          await apiRebox.post(`/notifications/charges`, {
            ...params,
            page: currentPage,
          });

          setProgress(prevValue => {
            if (prevValue < 99) {
              const currentProgress: number = prevValue + percentage;
              const [units, decimals] = currentProgress.toFixed(1).split('.');
              const progressUpdated = Number.parseFloat(
                decimals ? `${units}.${decimals.substring(0, 2)}` : units,
              );
              return progressUpdated;
            }
            return 99;
          });
        }

        setProgress(100);

        toastify(
          `Notificamos todas as ${total} cobranças encontradas.`,
          'success',
        );
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          const { methodAndDays, status, due_date } = errors;

          if (methodAndDays) toastify(methodAndDays, 'error');
          if (status) toastify(status, 'error');
          if (due_date) toastify(due_date, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else {
          toastify(
            'Houve um error ao tentar executar o gestor da comunicação de cobranças.',
            'error',
          );
        }
      } finally {
        setLoading(prevState => !prevState);
        setProgress(0);
      }
    },
    [byWhatsapp, bySms, byEmail],
  );
  return (
    <Container>
      <FormNotice onSubmit={handleCommunicateCustomers}>
        <Sections>
          <SubtitleSecondary textAlign="start" nameColor="black" fontSize={18}>
            Gestor da comunicação de cobranças
          </SubtitleSecondary>
          <Paragraph
            nameColor="black"
            textAlign="start"
            opacity={0.5}
            fontSize={15}
            style={{ marginBottom: '2vh' }}
          >
            Aqui notificamos todos os clientes sobre as cobranças segundo os
            critérios definidos abaixo.
          </Paragraph>

          <DividingLine />

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Notificar cobranças
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Consideramos sempre a data atual como base
              </Paragraph>
              <InputSelect
                name="methodAndDays"
                options={
                  ConfigLabel.rebox.others.communication.noticePeriodsForCharges
                }
                selectedDefault={'BEFORE:0'}
                placeholder="Selecione"
                tabIndex={1}
                onChange={event => {
                  if (event.target.value === 'UNDEFINED') {
                    setMoreFields(true);
                  } else setMoreFields(false);
                }}
              />
            </SectionsItem>
          </SectionsGroup>

          {moreFields && (
            <SectionsGroup>
              <SectionsItem>
                <SubtitleSecondary
                  textAlign="start"
                  nameColor="black"
                  fontSize={14}
                >
                  Para qual situação?
                </SubtitleSecondary>
                <Paragraph
                  nameColor="black"
                  textAlign="start"
                  opacity={0.5}
                  fontSize={13}
                  style={{ marginBottom: '2vh' }}
                >
                  Escolha para qual status de cobrança deseja enviar
                </Paragraph>
                <InputSelect
                  name="status"
                  options={ConfigLabel.rebox.others.communication.status}
                  selectedDefault={ConfigValues.rebox.payments.status.pending}
                  placeholder="Selecione"
                  tabIndex={1}
                />
              </SectionsItem>

              <SectionsItem>
                <SubtitleSecondary
                  textAlign="start"
                  nameColor="black"
                  fontSize={14}
                >
                  Que vencem em
                </SubtitleSecondary>
                <Paragraph
                  nameColor="black"
                  textAlign="start"
                  opacity={0.5}
                  fontSize={13}
                  style={{ marginBottom: '2vh' }}
                >
                  Informe para qual vencimento deseja notificar
                </Paragraph>
                <InputMask
                  name="due_date"
                  mask="99/99/9999"
                  placeholder="Informe uma data"
                  tabIndex={1}
                />
              </SectionsItem>
            </SectionsGroup>
          )}

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Canais de comunicação
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Escolha um ou mais meios de comunicação
              </Paragraph>
              <InputCheckBox
                label={
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    style={{ fontWeight: 500 }}
                  >
                    Por whatsapp
                  </Paragraph>
                }
                onChange={() => {
                  setByWhatsapp(prevState => !prevState);
                }}
                defaultChecked={byWhatsapp}
                style={{ textAlign: 'start' }}
              />

              <InputCheckBox
                label={
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    style={{ fontWeight: 500 }}
                  >
                    Por sms
                  </Paragraph>
                }
                onChange={() => {
                  setBySms(prevState => !prevState);
                }}
                defaultChecked={bySms}
                style={{ textAlign: 'start' }}
              />

              <InputCheckBox
                label={
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    style={{ fontWeight: 500 }}
                  >
                    Por e-mail
                  </Paragraph>
                }
                onChange={() => {
                  setByEmail(prevState => !prevState);
                }}
                defaultChecked={byEmail}
                style={{ textAlign: 'start' }}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <ButtonMain type="submit" loading={false} style={{ maxWidth: 250 }}>
              {!loading
                ? 'Iniciar'
                : progress !== 0
                ? `Executando (${progress}%)`
                : `Aguarde...`}
            </ButtonMain>
          </SectionsGroup>
        </Sections>
      </FormNotice>
    </Container>
  );
};

export default FormCommunication;
