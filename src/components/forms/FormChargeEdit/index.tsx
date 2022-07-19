// ./src/components/forms/FormChargeEdit/index.tsx
import React, { useRef, useState, useCallback } from 'react';

import { FormHandles } from '@unform/core';
// eslint-disable-next-line
import * as Yup from 'yup';
// eslint-disable-next-line
import {
  SubtitleSecondary,
  Paragraph,
  InputSelect,
  InputText,
  InputMask,
  ButtonMain,
} from '@components/index';

// Importações internas
import { ConfigLabel, ConfigValues } from '@config/index';
import Payment from '@models/Payment';
import { apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatDate, formatMoney } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

import { schemaCharge } from './schemaValidation';
import { IFormCharge } from './typing';

import {
  Container,
  FormCharge,
  Sections,
  SectionsGroup,
  SectionsItem,
} from './styles';

interface IProps {
  charge: Payment;
}

const FormChargeEdit: React.FC<IProps> = ({ charge }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line
  const [disabledForEditing, setDisabledForEditing] = useState<boolean>(
    charge?.status === ConfigValues.rebox.payments.status.deleted,
  );

  const handleUpdateCharge = useCallback(async (data: IFormCharge) => {
    try {
      setLoading(prevState => !prevState);

      formRef.current?.setErrors({});

      await schemaCharge.validate(data, {
        abortEarly: false,
      });

      const { data: responseChargeUpdated } = await apiRebox.put(
        `/payments/${charge?.id}`,
        {
          ...data,
          date_created: formatDate.removeMask(data.date_created),
          amount: formatMoney.revertToFloat(data.amount),
          due_date: formatDate.removeMask(data.due_date),
          pay_day: data.pay_day
            ? formatDate.removeMask(data.pay_day)
            : undefined,
        },
      );

      const { header } = responseChargeUpdated;
      toastify(header.message, 'success');
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        const {
          date_created,
          form_of_payment,
          amount,
          due_date,
          pay_day,
          status,
          charge_type,
          description,
        } = errors;

        if (date_created) toastify(date_created, 'error');
        if (form_of_payment) toastify(form_of_payment, 'error');
        if (amount) toastify(amount, 'error');
        if (due_date) toastify(due_date, 'error');
        if (pay_day) toastify(pay_day, 'error');
        if (status) toastify(status, 'error');
        if (charge_type) toastify(charge_type, 'error');
        if (description) toastify(description, 'error');
      } else if (error.response) toastify(error.response.data.error, 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <FormCharge
        ref={formRef}
        onSubmit={handleUpdateCharge}
        initialData={{
          date_created: formatDate.addMask(`${charge.date_created} `),
          amount: formatMoney.fromNumberToPrice(charge.amount || 0),
          due_date: formatDate.addMask(`${charge.due_date} `),
          pay_day: charge.pay_day
            ? formatDate.addMask(`${charge.pay_day} `)
            : '',
        }}
      >
        <Sections>
          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data de criação
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data em que a cobrança foi gerada
              </Paragraph>
              <InputMask
                name="date_created"
                mask="99/99/9999"
                placeholder="Informe a data"
                tabIndex={1}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Forma de pagamento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Método de pagamento a ser considerado na cobrança
              </Paragraph>

              <InputSelect
                name="form_of_payment"
                options={ConfigLabel.rebox.others.payment.form_of_payment}
                placeholder="Selecione"
                selectedDefault={charge?.form_of_payment}
                tabIndex={2}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Valor cobrado
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Valor que o cliente irá pagar
              </Paragraph>

              <InputText
                name="amount"
                placeholder="Apenas números"
                tabIndex={3}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={value => {
                  value.target.value = formatMoney.replaceFloatPatternsForMoney(
                    value.target.value,
                  );
                }}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data de vencimento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data limite que o cliente tem para pagar
              </Paragraph>
              <InputMask
                name="due_date"
                mask="99/99/9999"
                placeholder="Informe a data"
                tabIndex={4}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Situação da cobrança
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o status que a cobrança está atualmente
              </Paragraph>
              <InputSelect
                name="status"
                options={ConfigLabel.rebox.others.payment.status}
                placeholder="Selecione"
                selectedDefault={charge.status}
                tabIndex={5}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data de pagamento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data que o cliente efetuou o pagamento
              </Paragraph>
              <InputMask
                name="pay_day"
                mask="99/99/9999"
                placeholder="Informe a data"
                tabIndex={6}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Tipo da cobrança
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define a maneira que a cobrança está sendo paga
              </Paragraph>
              <InputSelect
                name="charge_type"
                options={ConfigLabel.rebox.others.payment.charge_type}
                placeholder="Selecione"
                selectedDefault={charge.charge_type}
                tabIndex={7}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Parcela correspondente
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Caso a cobrança esteja dividida, define sua posição
              </Paragraph>

              <InputText
                name="installment"
                placeholder="Posição da cobrança"
                tabIndex={8}
                readOnly={true}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Descrição
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informação adicional sobre a cobrança
              </Paragraph>

              <InputText
                name="description"
                placeholder="Escreva aqui"
                tabIndex={9}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={10}
            disabled={disabledForEditing}
            isDisable={disabledForEditing}
          >
            Salvar
          </ButtonMain>
        </Sections>
      </FormCharge>
    </Container>
  );
};

export default FormChargeEdit;
